import math
import geopandas as gpd
from shapely.geometry import Polygon
from geopy.distance import geodesic

# Define NW and SE coordinates
nw = (-103.2102579789362, 36.3429816620186)  # (longitude, latitude)
se = (-94.19048261442563, 29.689458780031472)

# Calculate total width and height of the bounding box in meters
width = geodesic((nw[1], nw[0]), (nw[1], se[0])).meters  # Distance East-West
height = geodesic((nw[1], nw[0]), (se[1], nw[0])).meters  # Distance North-South

# Define the grid shape (approx. 50x50)
grid_x, grid_y = 10, 10

# Calculate the size of each square
square_size = min(width / grid_x, height / grid_y)

# Adjust grid size to fit real squares
grid_x = math.floor(width / square_size)
grid_y = math.floor(height / square_size)

# Create grid of squares
squares = []
lat_step = (nw[1] - se[1]) / grid_y
lon_step = (se[0] - nw[0]) / grid_x

for i in range(grid_x):
    for j in range(grid_y):
        # Calculate square corners
        lon1 = nw[0] + i * lon_step
        lon2 = nw[0] + (i + 1) * lon_step
        lat1 = nw[1] - j * lat_step
        lat2 = nw[1] - (j + 1) * lat_step
        
        # Create square polygon
        square = Polygon([(lon1, lat1), (lon2, lat1), (lon2, lat2), (lon1, lat2), (lon1, lat1)])
        squares.append(square)

# Create a GeoDataFrame
grid_gdf = gpd.GeoDataFrame(geometry=squares, crs="EPSG:4326")
# Save to a GeoJSON if needed
grid_gdf.to_file(r"output/grid_polygons.geojson", driver="GeoJSON")
# Save or use grid_gdf as needed
print(grid_gdf)
