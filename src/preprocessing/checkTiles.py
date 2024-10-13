import os
from os import listdir
from os.path import isfile, join

import time
import math
import json

import numpy as np

import rasterio as rio
from rasterio.plot import show

from shapely.geometry import Point, Polygon

from eo import haversine
######################################################################################
resampling_size = 3
locationId = "B7"
roiId = "A0"
######################################################################################
script_dir = os.path.dirname(os.path.abspath(__file__))
split_dir = str(script_dir).split("/")
idx_src = split_dir.index("src")
parent_dir = split_dir[idx_src-1]
resources_path = os.path.join(parent_dir, "00_resources/")
data_path = os.path.join(parent_dir, "01_data/")
print(resources_path)

logJson = json.load(open("%s%s" % (resources_path,"A0"+"_log.json")))

######################################################################################
with rio.open("%s%s%s%s" % (r"ptcloud/01_data/3DEP/","elevation_",locationId,"_USGS_3DEP_1m.tif")) as src_elevation:
	#Make a subdict to log runtime stats for the oli data'
	start_time_oli = time.time()
	src_width = src_elevation.width
	src_height = src_elevation.height
	 
	b1_elevation = src_elevation.read(1)
	
	#Get the bo bounds of the geotif
	src_bounds = src_elevation.bounds

	#Get the boundining box (bb) points and calc the bb width and height
	bb_pt1 = [src_bounds[0],src_bounds[1]]
	bb_pt2 = [src_bounds[2],src_bounds[3]]
	bb_width = bb_pt2[0] - bb_pt1[0]
	bb_height = bb_pt2[1] - bb_pt1[1]
	
	#Calculate the stepsize btwn pixels based on pooling window size
	step_width = bb_width/(src_width/resampling_size)
	step_height = bb_height/(src_height/resampling_size)*-1

	bb_pt3 = [bb_pt1[0],bb_pt2[1]]
	bb_pt4 = [bb_pt2[0],bb_pt1[1]]

	bb_polygonCorrds = [(src_bounds[0], src_bounds[1]), (bb_pt2[0], bb_pt1[1]), (src_bounds[2], src_bounds[3]), (bb_pt1[0], bb_pt2[1])]
	bb_polygon = Polygon(bb_polygonCorrds)

	pts = []
	b1_elevation = np.array(b1_elevation)
	pxl_dist = 2.7355724505070387
	width_ft = src_width*pxl_dist
	height_ft = src_height*pxl_dist
	print(f"Distance: {width_ft} feet")
######################################################################################
#Get the tiles from the first year of the analysis. These will be used for determining time overlap.
tiles = logJson["tiles"][str(logJson["year_start"])]
#Store the caculated overlap in ls_overlap
ls_overlap = []
#For each tile, get the bounding box coordinates of the tile
#Construct a polygon from the tile bounding box coordinates
for tileId,tileObj in tiles.items():
	polygon_coords = []
	for ptId, ptCoords in tileObj["geometry"].items():
		polygon_coords.append((ptCoords[1],ptCoords[0]))
	tile_polygon = Polygon(polygon_coords)
	#Calculate the overlap between the 3Dep tile and the Landsat tile
	overlap_area = bb_polygon.intersection(tile_polygon).area
	percent_overlap = (overlap_area / bb_polygon.area) * 100

	if percent_overlap > 0:
		tileJsonName = str(roiId+"_comp_"+tileId+"_V1.json")
		tile_path = os.path.join(data_path, roiId, "ls_tiles/composite/json/", tileJsonName)
		tileJson = json.load(open(tile_path))
		for ls_data in tileJson:
			ls_centroid = ls_data["centroid"]
			ls_pt = Point(ls_centroid[0], ls_centroid[1])
			is_inside = bb_polygon.contains(ls_pt)
			if is_inside == True:
				ls_overlap.append(ls_data)

for elvPt in b1_elevation:
	
			#'ptcloud/01_data/A0/ls_tiles/composite/json/A0_comp_0-4_V1.json'
			#'ptcloud/01_data/ls_tiles/composite/json/A0_comp_0-4_V1.json'

	#print(tileId, percent_overlap)






