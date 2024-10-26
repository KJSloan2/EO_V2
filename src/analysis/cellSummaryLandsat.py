import json
import sqlite3
import os
import math
import numpy as np

import geopandas as gpd
from shapely.geometry import Point, Polygon

import fiona
from scipy.spatial import cKDTree
######################################################################################
# Connect to the SQLite database (create connection)
conn = sqlite3.connect('tiles_temporal.db')  # Replace 'example.db' with your database name
cursor = conn.cursor()

# Query to get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
# Fetch and print the table names
tables = cursor.fetchall()
tableIds = []
for table in tables:
	tableIds.append(table[0])

geojson_path = r"EO/01_data/A0/A0_tileReferencePolygons_TEST.geojson"
######################################################################################
def mean_coords(coords, idx):
    if not coords:
        return None  # Handle empty list
    # Extract all longitude values (second element in each pair)
    vals = [coord[idx] for coord in coords]
    # Calculate and return the mean of longitude values
    return sum(vals) / len(vals)
######################################################################################
def haversine_meters(pt1, pt2):
	"""Calculate the distance in meters between two points."""
	R = 6371000  # Radius of Earth in meters
	phi1, phi2 = math.radians(pt1[0]), math.radians(pt2[0])
	delta_phi = math.radians(pt2[0] - pt1[0])
	delta_lambda = math.radians(pt2[1] - pt1[1])

	a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

	return R * c  # Distance in meters
######################################################################################
output = {"type": "FeatureCollection", "features": []}
######################################################################################
with fiona.open(geojson_path, 'r') as cells_geojson:
	print(f"Number of features: {len(cells_geojson)}")
	#'tile_id':[], 'cell_id':[], 'cell_centroid':[]
	feature_reference = {}
	ref_tileIds = []

	feature = cells_geojson[0]
	featureCoordinates = feature['geometry']['coordinates'][0]
	polygonCoods = []
	for coord in featureCoordinates:
		polygonCoods.append([float(coord[0]),float(coord[1])])
	mean_lat = mean_coords(polygonCoods, 0)
	mean_lon = mean_coords(polygonCoods, 1)

	diagDist = haversine_meters([mean_lat, mean_lon], [polygonCoods[0][0],polygonCoods[0][1]])
	print(diagDist)

	for feature in cells_geojson:
		featureId = feature['properties']['name']
		parse_featureId = featureId.split("_")
		tile_id = parse_featureId[0]
		cell_id = parse_featureId[1]

		featureCoordinates = feature['geometry']['coordinates'][0]

		#Compile the coordinates into an array
		polygonCoods = []
		polygonCoords_ = []
		for coord in featureCoordinates:
			polygonCoods.append([float(coord[0]),float(coord[1])])
			polygonCoords_.append((float(coord[0]),float(coord[1])))

		polygon = Polygon(polygonCoords_)
		#Use the mean_coords function to calculate the centroid
		mean_lat = mean_coords(polygonCoods, 0)
		mean_lon = mean_coords(polygonCoods, 1)

		if tile_id not in ref_tileIds:
			ref_tileIds.append(tile_id)
			feature_reference[tile_id] = {'cell_id':[cell_id], 'cell_centroid':[(mean_lat, mean_lon)], 'polygon':[polygon], 'lstf':[[]], 'ndvi':[[]]}
		else:
			feature_reference[tile_id]['cell_id'].append(cell_id)
			feature_reference[tile_id]['cell_centroid'].append((mean_lat, mean_lon))
			feature_reference[tile_id]['polygon'].append(polygon)
			feature_reference[tile_id]['lstf'].append([])
			feature_reference[tile_id]['ndvi'].append([])

	for tile_id, featureObj in feature_reference.items():
		feature_kdTree = cKDTree(featureObj['cell_centroid'])
		featureObj['kdtree'] = feature_kdTree
		tableId = 'tile_'+str(tile_id[0])+"_"+str(tile_id[2])

		query = f"SELECT * FROM {tableId}"
		
		cursor.execute(query)

		# Fetch all rows from the query result
		rows = cursor.fetchall()
		for row in rows:
			lat = row[4]
			lon = row[5]
			#point = Point(lat, lon)
			query_point = (lat, lon)
			cp_idx = featureObj['kdtree'].query(query_point)[1]
			cell_centroid = featureObj['cell_centroid'][cp_idx]

			dist = haversine_meters([lat, lon], [cell_centroid[0], cell_centroid[1]])
			#'id': 'TEXT PRIMARY KEY','lstf': 'FLOAT','ndvi': 'FLOAT','lat': 'FLOAT','lon': 'FLOAT'
			if dist <= diagDist:
				polygon = featureObj['polygon'][cp_idx]
				query_point = Point(lat, lon)
				if polygon.contains(query_point):
					featureObj['lstf'][cp_idx].append(row[2])
					featureObj['ndvi'][cp_idx].append(row[3])

		for cellId, lstfLst, ndviLst, polygon in zip(
			feature_reference[tile_id]['cell_id'],
			feature_reference[tile_id]['lstf'],
			feature_reference[tile_id]['ndvi'],
			feature_reference[tile_id]['polygon']
			):
			if len(lstfLst) > 0:		
				mean_lstf = np.mean(lstfLst)
				mean_ndvi = np.mean(ndviLst)
				print(mean_lstf, mean_ndvi)

				polygonCoords = [list(coord) for coord in polygon.exterior.coords]

				feature = {
					"type": "Feature",
					"geometry": {
						"type": "Polygon",
						"coordinates": [polygonCoords]
					},
					"properties": {
						"cell_id": cellId,
						"tile_id": tile_id,
						"mean_lstf": mean_lstf,
						"mean_ndvi":mean_ndvi
					}
				}

				output["features"].append(feature)

output_path = r"PATH TO OUTPUT DIRECTORY"

with open(os.path.join(output_path, "A0_cellSummaries.geojson"), "w", encoding='utf-8') as output_json:
	json.dump(output, output_json, indent=1, ensure_ascii=False)

print("DONE")
