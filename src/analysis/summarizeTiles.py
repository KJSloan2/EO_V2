import json
import numpy as np
import math
import csv

def standard_deviation(data):
    if len(data) == 0:
        raise ValueError("The list must contain at least one number.")
    
    mean = sum(data) / len(data)
    variance = sum((x - mean) ** 2 for x in data) / len(data)
    std_dev = math.sqrt(variance)
    
    return std_dev
######################################################################################
def skewness(data):
    if len(data) == 0:
        raise ValueError("The list must contain at least one number.")
    
    n = len(data)
    mean = sum(data) / n
    std_dev = standard_deviation(data)
    
    skewness_numerator = sum((x - mean) ** 3 for x in data)
    skewness_denominator = n * (std_dev ** 3)
    
    skewness_value = skewness_numerator / skewness_denominator
    
    return skewness_value
######################################################################################
def kurtosis(data):
    if len(data) == 0:
        raise ValueError("The list must contain at least one number.")
    
    n = len(data)
    mean = sum(data) / n
    std_dev = standard_deviation(data)
    
    kurtosis_numerator = sum((x - mean) ** 4 for x in data)
    kurtosis_denominator = n * (std_dev ** 4)
    
    kurtosis_value = kurtosis_numerator / kurtosis_denominator - 3  # Subtract 3 for excess kurtosis
    
    return kurtosis_value
######################################################################################

logJson = json.load(open("%s%s" % (r"00_resources/","A0_log.json")))

analysis_version = logJson["analysis_version"]
location_key = logJson["location_key"]
tiles_summmary = {}

write_output = open(r"01_data/A0/tile_summaries.csv", 'w',newline='', encoding='utf-8')
writer_output = csv.writer(write_output)
writer_output.writerow(["year","tile","ndvi_range","ndvi_freq", "lstf_range","lstf_freq"])

for year, tileObjs in logJson["tiles"].items():
    for tileId, tile in tileObjs.items():
        dir_path = r"01_data/A0/tiles/"+str(year)+"/json/"
        f_name = location_key+"_"+str(year)+"_"+tileId+"_"+analysis_version+".json"
        f_path = "%s%s" % (dir_path, f_name)
        data = json.load(open(f_path))

        ndvi_histogram = {
            "1":0, "2":0, "3":0, "4":0, "5":0,
            "6":0, "7":0, "8":0, "9":0, "10":0
        }

        lstf_histogram = {
            "50-60":0, "60-70":0, "70-80":0, "80-90":0, "90-100":0,
            "100-110":0, "110-120":0, "120-130":0, "130-140":0, "140-150":0
        }

        lstf_ranges = [[50, 59.999],[60, 69.999],[70, 79.999],[80,89.999],[90,99.999],[100,109.999],[110,119.999],[120,129.999],[130,139.999],[140, 149.999]]

        ndvi_histogram_keys = list(ndvi_histogram.keys())
        lstf_histogram_keys = list(lstf_histogram.keys())

        for d in data:
            ndvi = d["ndvi"]
            ndvi_deci = int(ndvi*10)
            ndvi_histogram[ndvi_histogram_keys[ndvi_deci]]+=1

            lstf = d["lstf"]
            for i,r in enumerate(lstf_ranges):
                if r[0] <= lstf <= r[1]:
                    lstf_histogram[lstf_histogram_keys[i]]+=1
                    break

        
        for ndviKey, lstfKey in zip(ndvi_histogram_keys, lstf_histogram_keys):
            ndviHistVal = ndvi_histogram[ndviKey]
            lsftHistVal = lstf_histogram[lstfKey]
            writer_output.writerow([year, tileId, ndviKey, ndviHistVal, lstfKey, lsftHistVal])

        '''ndvi_mean = np.mean(pool_ndvi)
        ndvi_std = standard_deviation(pool_ndvi)
        ndvi_skew = skewness(pool_ndvi)
        ndvi_kurt = kurtosis(pool_ndvi)'''

        print(ndvi_histogram)

        '''tiles_summmary[location_key+"_"+str(year)+"_"+tileId+"_"+analysis_version] = {
            "ndvi":{
                "mean":ndvi_mean,
                "std": ndvi_std,
                "skew": ndvi_skew,
                "kurt": ndvi_kurt
                }
            }'''
        
        #print(ndvi_mean, ndvi_std, ndvi_skew, ndvi_kurt)

with open("%s%s" % (r"01_data/A0/",location_key+"_"+"tile_summary.json"), "w", encoding='utf-8') as output_json:
	output_json.write(json.dumps(tiles_summmary, indent=2, ensure_ascii=False))