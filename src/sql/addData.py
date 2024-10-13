import sqlite3
import pandas as pd
import os
import json

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('tiles_temporal.db')

# Create a cursor object to execute SQL queries
cursor = conn.cursor()


logJson = json.load(open(os.path.join(r"EO/00_resources/A0_log.json")))
locationId = logJson["location_key"]

tileIds = []
for tileId, tile in logJson["tiles"][str(logJson["year_start"])].items():
	tileIds.append(tileId)
	
for tileId in tileIds:
	print(tileId)
	fName_tile = locationId+"_comp_"+tileId+".json"
	path_tile = os.path.join(r"EO","02_output",locationId,"composite","json",fName_tile)
	tileData = json.load(open(path_tile))
	  
	df = pd.read_csv(file_path)
	df.to_sql(tableName, conn, if_exists='replace', index=False)

# Commit the transaction
conn.commit()

# Close the connection
conn.close()
