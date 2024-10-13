import json

output = {
    "type": "FeatureCollection",
    "features": []
  }

logJson = json.load(open("%s%s" % (r"00_resources/","A0_log.json")))
location_key = logJson["location_key"]
tiles = logJson["tiles"]
for tileId, tile in tiles["2013"].items():
    tile_geometry = tile["geometry"]
    feature = {"type": "Feature", "geometry":{
        "type": "Polygon",
        "coordinates": [[]],
        "properties": {
          "name": tileId
          }
        }
    }

    for ptId, ptCoords in tile_geometry.items():
        feature["geometry"]["coordinates"][0].append([ptCoords[1],ptCoords[0]])
    
    output["features"].append(feature)

with open("%s%s" % (r"01_data/A0/",location_key+"_"+"tileReferencePolygons.geojson"), "w", encoding='utf-8') as output_json:
	output_json.write(json.dumps(output, indent=2, ensure_ascii=False))
     
print("DONE")