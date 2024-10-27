import os
import sqlite3
import pandas as pd
import sqlite3

conn = sqlite3.connect('usgs_features.db')

def create_table(table_name, columns):
    cursor = conn.cursor()
    # Create a dynamic SQL query to create a table
    column_defs = ', '.join([f"{col} {dtype}" for col, dtype in columns.items()])
    query = f"CREATE TABLE IF NOT EXISTS {table_name} ({column_defs})"
    # Execute the query
    cursor.execute(query)
    # Commit and close
    conn.commit()
    print(table_name)

conn = sqlite3.connect('usgs_features.db')

#Initialize a data table to store temporal representations of the raster data for the tile
#FEATURE_ID,FEATURE_NAME,FEATURE_CLASS,STATE_ALPHA,STATE_NUMERIC,COUNTY_NAME,COUNTY_NUMERIC,PRIMARY_LAT_DMS,PRIM_LONG_DMS,PRIM_LAT_DEC,PRIM_LONG_DEC,SOURCE_LAT_DMS,SOURCE_LONG_DMS,SOURCE_LAT_DEC,SOURCE_LONG_DEC,ELEV_IN_M,ELEV_IN_FT,MAP_NAME,DATE_CREATED,DATE_EDITED
create_table('usgs_features_tx', {
    'id': 'TEXT PRIMARY KEY','name': 'TEXT','class': 'TEXT','county_name':'TEXT', 'county_numeric':'INTEGER',
    'primary_lat_dms':'FLOAT','primary_lon_dms':'FLOAT','primary_lat_dec':'FLOAT','primary_lon_dec':'FLOAT',
    'elevation_m':'FLOAT', 'elevation_ft':'FLOAT', 'map_name':'TEXT', 'date_created':'TEXT', 'date_edited':'TEXT'
    })

conn.close()