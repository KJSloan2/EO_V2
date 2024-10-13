import json
import os


'''logJson = json.load(open(os.path.join(r"EO/00_resources/A0_log.json")))
locationId = logJson["location_key"]
tileIds = []
for tileId, tile in logJson["tiles"][str(logJson["year_start"])].items():
	tileIds.append(tileId)
######################################################################################

class LstfGroup:
	def __init__(self,v1,v2,v3,v4):
		self.lstfn = v1
		self.binary_values = v2
		self.feature_values = v3
		self.group_id = v4

for tileId in tileIds:
	print(tileId)
	fName_tile = locationId+"_comp_"+tileId+".json"
	path_tile = os.path.join(r"EO","02_output",locationId,"composite","json",fName_tile)
	tileData = json.load(open(path_tile))
	
	for pxlData in tileData:'''
		
	


import sqlite3
import numpy as np
import copy
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap  # Import ListedColormap from the correct module


# Connect to the SQLite database
conn = sqlite3.connect('tiles_temporal.db')

# Create a cursor object to execute SQL queries
cursor = conn.cursor()

# Query to get all the table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
#tables = cursor.fetchall()


table_id = "tile_0_0"
cursor.execute(f'SELECT MAX({"row_id"}) FROM {table_id}')
max_rowIdx = cursor.fetchone()[0]

cursor.execute(f'SELECT MAX({"column_id"}) FROM {table_id}')
max_columnIdx = cursor.fetchone()[0]


class LstfLayer:
	def __init__(self,v1,v2,v3,v4):
		self.temp_range = v1
		self.binary_values = v2
		self.feature_values = v3
		self.group_ids = v4

tempRanges = [
	[20,29.99],[30,39.99],[40,49.99],[50,59.99],
	[60,69.99],[70,79.99],[80,89.99],[90,99.99],
	[100,110.99],[110,119.99],[120,120.99]]

lstfLayers = []
zeros = np.zeros((max_rowIdx+1, max_columnIdx+1))
for i, tempRange in enumerate(tempRanges):
	lstfLayers.append(
		LstfLayer(tempRange,
			copy.deepcopy(zeros), 
			copy.deepcopy(zeros), 
			copy.deepcopy(zeros)))

lstf_index_array = np.zeros((max_rowIdx, max_columnIdx))

def get_moore_neighborhood(array, i, j):
	# Get the dimensions of the array
	rows, cols = array.shape
	# Define the boundaries for the 3x3 neighborhood, ensuring we don't go out of bounds
	row_start = max(0, i - 1)
	row_end = min(max_rowIdx, i + 2)  # i+2 because Python slicing is exclusive at the end
	col_start = max(0, j - 1)
	col_end = min(max_columnIdx, j + 2)  # j+2 because Python slicing is exclusive at the end
	# Extract the neighborhood
	neighborhood = array[row_start:row_end, col_start:col_end]
	return neighborhood

cursor.execute(f'SELECT * FROM {table_id}')
rows = cursor.fetchall()
#row_idx, column_idx, lstf, ndvi, lon, lat
for row in rows:
	row_idx = row[0]
	column_idx = row[1]
	lstf = row[2]
	for i, tempRange in enumerate(tempRanges):
		if tempRange[0] <= lstf <= tempRange[1]:
			lstfLayers[i].binary_values[row_idx][column_idx] = 1
			break


def is_within_bounds(i, j, array):
	return 0 <= i < array.shape[0] and 0 <= j < array.shape[1]

# Define a list of possible movements (up, down, left, right)
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

# Start the process at the given index and group with a group ID
def fill_from_index(array_bv, array_gi, start_i, start_j, group_id):
	# If the starting point is not 1 or has already been assigned a group, return early
	if array_bv[start_i, start_j] != 1 or array_gi[start_i, start_j] != 0:
		return
	
	# Initialize a stack for the positions to check (flood fill style)
	stack = [(start_i, start_j)]
	
	while stack:
		# Pop a position from the stack
		i, j = stack.pop()

		# Assign the current position to the group ID in array_gi
		array_gi[i, j] = group_id

		# Check all 4 possible adjacent cells
		for direction in directions:
			ni, nj = i + direction[0], j + direction[1]

			# Check if the new position is within bounds, has value 1, and hasn't been assigned a group ID
			if is_within_bounds(ni, nj, array_bv) and array_bv[ni, nj] == 1 and array_gi[ni, nj] == 0:
				# Add the new position to the stack for further processing
				stack.append((ni, nj))

# Function to find and assign group IDs to all connected components in array_bv
def assign_group_ids(array_bv, array_gi):
	group_id = 1  # Start group ID from 1
	# Loop through all the elements in the array
	for i in range(array_bv.shape[0]):
		for j in range(array_bv.shape[1]):
			# If the current position has value 1 and hasn't been assigned a group ID
			if array_bv[i, j] == 1 and array_gi[i, j] == 0:
				# Fill the connected component starting from this position with the current group ID
				fill_from_index(array_bv, array_gi, i, j, group_id)
				group_id += 1  # Increment the group ID for the next connected component
				

cmap = ListedColormap(['white', 'red'])
groupCounter = 1
for lstfLayerObj in lstfLayers:
	lstfLayerObj.binary_values = np.pad(lstfLayerObj.binary_values, pad_width=1, mode='constant', constant_values=0)
	lstfLayerObj.feature_values = np.pad(lstfLayerObj.feature_values, pad_width=1, mode='constant', constant_values=0)
	lstfLayerObj.group_ids = np.pad(lstfLayerObj.group_ids, pad_width=1, mode='constant', constant_values=0)
	idx_notZero = np.where(lstfLayerObj.binary_values == 1)
	if len(idx_notZero[0]) >1:
		# Call the function to assign group IDs
		assign_group_ids(lstfLayerObj.binary_values, lstfLayerObj.group_ids)

		#cmap = plt.cm.get_cmap('tab20', np.max(lstfLayerObj.group_ids) + 1)  # Use a colormap with discrete colors
		cmap = plt.cm.get_cmap('tab20', int(np.max(lstfLayerObj.group_ids) + 1))
		# Create a color-coded plot
		plt.figure(figsize=(6, 6))
		plt.imshow(lstfLayerObj.group_ids, cmap=cmap, interpolation='nearest')

		# Add a colorbar for reference
		#plt.colorbar(ticks=range(int(np.max(lstfLayerObj.group_ids) + 1)), label='Group ID')

		# Add grid lines for better readability
		#plt.grid(which='both', color='black', linestyle='-', linewidth=0.5)

		# Remove axis labels (optional)
		#plt.axis('off')

		# Show the plot
		plt.show()

	'''for i,j in zip(idx_notZero[0],idx_notZero[1]):
		neighborhood_bv = get_moore_neighborhood(lstfLayerObj.binary_values, i, j)
		neighborhood_fv = get_moore_neighborhood(lstfLayerObj.feature_values, i, j)
		neighborhood_gi = get_moore_neighborhood(lstfLayerObj.group_ids, i, j)

		fv = np.sum(neighborhood_bv)
		neighborhood_fv[i][j] = fv
		
		sum_neighborhood_gi = np.sum(neighborhood_gi) 
		groupId = neighborhood_gi[i][j]
		if groupId == 0 and sum_neighborhood_gi == 0:
			neighborhood_gi[i][j] = groupCounter'''
	  



		

	# Create the plot
	'''plt.imshow(lstfLayerObj.binary_values, cmap=cmap)

	# Remove the axis labels
	plt.axis('off')

	# Display the plot
	plt.show()'''


'''cursor.execute(f"SELECT * FROM {table_name[0]}")
rows = cursor.fetchall()
for row in rows:
	print(row)'''
'''# Iterate over the tables and print their contents
for table_name in tables:
	print(f"Contents of table {table_name[0]}:")
	cursor.execute(f"SELECT * FROM {table_name[0]}")
	rows = cursor.fetchall()
	for row in rows:
		print(row)
	print("\n")  # Separate tables by a newline

# Close the connection'''
conn.close()