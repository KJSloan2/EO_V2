import numpy as np
import json
import os
######################################################################################
locationId = "A0"
######################################################################################
def normailize_linear_instance(val,d_min,d_max):
	return round(((val-d_min)/(d_max-d_min)),6)
######################################################################################
fNames_data = []
fNames = []

#logJson = json.load(open(os.path.join(r"EO/00_resources/",str(locationId+"_log.json"))))
logJson = json.load(open(os.path.join(r"EO/00_resources/A0_log.json")))

tileIds = []
for tileId, tile in logJson["tiles"][str(logJson["year_start"])].items():
	tileIds.append(tileId)

for tileId in tileIds:
	for year, tiles in logJson["tiles"].items():
        #EO/01_data/tiles/
		fName = locationId+"_"+str(year)+"_"+tileId+"_V1"+".json"
		tileData = json.load(open(os.path.join(r"EO", "01_data", locationId, "tiles", str(year),"json", fName)))
		
'''#Store data of tiles that overlap with the 3DEP tile.
ls_overlap = []

#For each tile, get the bounding box coordinates of the tile
#Construct a polygon from the tile bounding box coordinates
for tileId,tileObj in tiles.items():
	polygon_coords = []
	for ptId, ptCoords in tileObj["geometry"].items():
		polygon_coords.append((ptCoords[1],ptCoords[0]))
	tile_polygon = Polygon(polygon_coords)
	#Calculate the overlap between the 3Dep t'''