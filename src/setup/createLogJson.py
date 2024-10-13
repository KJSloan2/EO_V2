import json
location_key = input("Location Key: ")
analysis_version = input("Analysis Version: ")

logJson = { 
    "mongoDB":{"connection_uri":None},
    "analysis_version": analysis_version,
    "location_key": location_key,
    "year_start": None,
    "year_end": None,
    "run_stats": {
        "start_time": None,
        "end_time": None,
        "duration": None
    },
    "final_output_files": {
    "landsat_temporal": None,
    "3dep_terain": None
    },
    "processed_tifs": {},
    "preprocessing_output": [],
    "tiles": {}
}

with open("%s%s%s" % (r"00_resources/",location_key+"_","log.json"), "w", encoding='utf-8') as output_json:
	output_json.write(json.dumps(logJson, indent=2, ensure_ascii=False))
	
    