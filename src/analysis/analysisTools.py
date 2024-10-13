import math
######################################################################################
######################################################################################
def haversine_meters(pt1, pt2):
	# Radius of the Earth in meters
	R = 6371000
	# Convert latitude and longitude from degrees to radians'
	lat1, lon1 = pt1[1], pt1[0]
	lat2, lon2 = pt2[1], pt2[0]
	phi1 = math.radians(lat1)
	phi2 = math.radians(lat2)
	delta_phi = math.radians(lat2 - lat1)
	delta_lambda = math.radians(lon2 - lon1)
	# Haversine formula
	a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
	c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
	coef_ft = 3.28084
	# Distance in meters
	dist_m = R * c
	dist_ft = dist_m*coef_ft
	dist_ml = round((dist_ft/5280),2)
	return {"ft":dist_ft, "m":dist_m, "ml":dist_ml}
######################################################################################
######################################################################################
from math import radians, cos, sin, asin, sqrt

def haversine(pt1, pt2):

	R = 3959.87433 # this is in miles.  For Earth radius in kilometers use 6372.8 km
	#R = 6371000
	lat1, lon1 = pt1[1], pt1[0]
	lat2, lon2 = pt2[1], pt2[0]

	dLat = radians(lat2 - lat1)
	dLon = radians(lon2 - lon1)
	lat1 = radians(lat1)
	lat2 = radians(lat2)

	a = sin(dLat/2)**2 + cos(lat1)*cos(lat2)*sin(dLon/2)**2
	c = 2*asin(sqrt(a))

	dist_m = R * c
	coef_ft = 3.28084
	dist_ft = dist_m*coef_ft
	dist_ml = round((dist_ft/5280),2)
	return {"ft":dist_ft, "m":dist_m, "ml":dist_ml}
######################################################################################
######################################################################################

pts = [
	[-99.03198372037589,30.24672477394635],
	[ -98.83013227603423,30.37877712071192],
	[-99.03198372037589,30.37877712071192],
	[-98.83013227603423,30.24672477394635]
]
	
dist = haversine(pts[0], pts[2])
#13.950527590595804
#1.43273259617867
print(dist)