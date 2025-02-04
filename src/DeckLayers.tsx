// DeckLayers.tsx
import React, { useState, useEffect, useRef} from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre"
import { AmbientLight, LightingEffect } from "@deck.gl/core"; ;
import {CSVLoader} from '@loaders.gl/csv';
import {load} from '@loaders.gl/core';
import { useDeckTerrainLayers } from "./DeckTerrain";
import { useDeckParcels } from "./DeckParcels";
import { useDeckUsgsFeatures } from "./DeckUsgsFeatures";
import ControlPanel from "./ControlPanel";
import LegendUsgsFeatures from "./LegendUsgsFeatures";
import LegendVegetation from "./LegendVegetation";
import './App.css';

const POI = [29.33837260928762, -103.59965184419559, 500];
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

const ambientLight = new AmbientLight({
    color: [255, 255, 255], 
    intensity: 3, 
  });

const lightingEffect = new LightingEffect({ ambientLight });

const INITIAL_VIEW_STATE = {
  latitude: POI[0],
  longitude: POI[1],
  zoom: 17,
  maxZoom: 20,
  minZoom: 1,
  pitch: 45,
  bearing: 0,
};

const DeckLayers = () => {
    const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
    const [terrainOpacity, setTerrainOpacity] = useState(0.5);
    const [terrainPointRadius, setTerrainPointRadius] = useState(1);
    const [isRotating, setIsRotating] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    //const [isCollapsedLegendPanel, setIsCollapsedLegendPanel] = useState(false);

    const [landsatData, setLandsatData] = useState([]);
    const [showLandsat, setShowLandsat] = useState(false);
    //const [terrainColorMetric, setTerrainColorMetric] = useState("lstf_normalized");
  
    const [fieldPhotoPoints, setFieldPhotoPoints] = useState([]);
    const [showFieldPhotoPoints, setShowFieldPhotoPoints] = useState(false);

    const [showParcels, setShowParcels] = useState(false);
    const [parcelData, setParcelData] = useState(null)
    const [parcelTooltip, setParcelTooltip] = useState(null);

    const terrainColorMetricRef = useRef("altitude");
    const [terrainColorMetricState, setTerrainColorMetricState] = useState("altitude");

    const [usgsFeatureData, setUsgsFeatureData] = useState<UsgsFeature[]>([]);

    const [showUsgsFeatures, setShowUsgsFeatures] = useState(false);
    const [usgsFeatureKey, setUsgsFeatureKey] = useState('ALL');
    const [usgsFeaturePointSize, setUsgsFeaturePointSize] = useState(1000);
    const [usgsFeaturePointOpacity, setUsgsFeaturePointOpacity] = useState(.5);
    
    // Manual state trigger for terrain layer updates
    const [forceTerrainUpdate, setForceTerrainUpdate] = useState(0);
    
    const handleTerrainColorMetricChange = (value) => {
        if (terrainColorMetricRef.current !== value) {
            terrainColorMetricRef.current = value;
            setTerrainColorMetricState(value); // Update local UI state
            setForceTerrainUpdate(prev => prev + 1); // Force terrain layer update
        }
    };

    const COLOR_SCALE = [
        [65, 182, 196, 255], [127, 205, 187, 255], [199, 233, 180, 255],
        [237, 248, 177, 255], [255, 255, 204, 255], [255, 237, 160, 255],
        [254, 217, 118, 255], [254, 178, 76, 255], [253, 141, 60, 255],
        [252, 78, 42, 255], [227, 26, 28, 255], [189, 0, 38, 255],
        [128, 0, 38, 255]
      ];

      const NDVI_COLOR_SCALE = [
        [128, 0, 38, 255],   // Dark Red
        [189, 0, 38, 255],   // Deep Red
        [227, 26, 28, 255],  // Red
        [252, 78, 42, 255],  // Orange-Red
        [253, 141, 60, 255], // Orange
        [254, 217, 118, 255],// Yellow-Orange
        [237, 248, 177, 255],// Yellow-Green
        [199, 233, 180, 255],// Light Green
        [127, 205, 187, 255],// Green
        [50, 205, 50, 255]   // Lime Green
    ];
    
    const usgsFeatureColors: Record<string, string> = {
        'ALL': 'rgb(255, 0, 0)', // Red
        'Airport': 'rgb(255, 69, 0)', // Orange-Red
        'Arch': 'rgb(255, 140, 0)', // Dark Orange
        'Area': 'rgb(255, 215, 0)', // Gold
        'Arroyo': 'rgb(218, 165, 32)', // Goldenrod
        'Bar': 'rgb(184, 134, 11)', // Dark Goldenrod
        'Basin': 'rgb(189, 183, 107)', // Dark Khaki
        'Bay': 'rgb(0, 255, 255)', // Cyan
        'Beach': 'rgb(70, 130, 180)', // Steel Blue
        'Bench': 'rgb(176, 196, 222)', // Light Steel Blue
        'Bend': 'rgb(30, 144, 255)', // Dodger Blue
        'Bridge': 'rgb(0, 191, 255)', // Deep Sky Blue
        'Building': 'rgb(135, 206, 235)', // Sky Blue
        'Canal': 'rgb(64, 224, 208)', // Turquoise
        'Cape': 'rgb(32, 178, 170)', // Light Sea Green
        'Cemetery': 'rgb(0, 128, 0)', // Green
        'Census': 'rgb(50, 205, 50)', // Lime Green
        'Channel': 'rgb(34, 139, 34)', // Forest Green
        'Church': 'rgb(107, 142, 35)', // Olive Drab
        'Civil': 'rgb(189, 183, 107)', // Dark Khaki
        'Cliff': 'rgb(128, 128, 0)', // Olive
        'Crater': 'rgb(139, 69, 19)', // Saddle Brown
        'Crossing': 'rgb(165, 42, 42)', // Brown
        'Dam': 'rgb(210, 105, 30)', // Chocolate
        'Falls': 'rgb(205, 133, 63)', // Peru
        'Flat': 'rgb(244, 164, 96)', // Sandy Brown
        'Forest': 'rgb(34, 139, 34)', // Forest Green
        'Gap': 'rgb(85, 107, 47)', // Dark Olive Green
        'Gut': 'rgb(152, 251, 152)', // Pale Green
        'Harbor': 'rgb(0, 100, 0)', // Dark Green
        'Hospital': 'rgb(255, 0, 255)', // Magenta
        'Island': 'rgb(153, 50, 204)', // Dark Orchid
        'Lake': 'rgb(75, 0, 130)', // Indigo
        'Levee': 'rgb(147, 112, 219)', // Medium Purple
        'Locale': 'rgb(123, 104, 238)', // Medium Slate Blue
        'Military': 'rgb(106, 90, 205)', // Slate Blue
        'Mine': 'rgb(72, 61, 139)', // Dark Slate Blue
        'Oilfield': 'rgb(0, 0, 139)', // Dark Blue
        'Park': 'rgb(0, 0, 205)', // Medium Blue
        'Pillar': 'rgb(25, 25, 112)', // Midnight Blue
        'Plain': 'rgb(240, 230, 140)', // Khaki
        'Populated Place': 'rgb(255, 222, 173)', // Navajo White
        'Post Office': 'rgb(210, 180, 140)', // Tan
        'Range': 'rgb(160, 82, 45)', // Sienna
        'Rapids': 'rgb(255, 250, 205)', // Lemon Chiffon
        'Reserve': 'rgb(250, 250, 210)', // Light Goldenrod Yellow
        'Reservoir': 'rgb(255, 239, 213)', // Papaya Whip
        'Ridge': 'rgb(255, 228, 181)', // Moccasin
        'School': 'rgb(255, 218, 185)', // Peach Puff
        'Sea': 'rgb(245, 222, 179)', // Wheat
        'Slope': 'rgb(139, 0, 0)', // Dark Red
        'Spring': 'rgb(178, 34, 34)', // Fire Brick
        'Stream': 'rgb(205, 92, 92)', // Indian Red
        'Summit': 'rgb(220, 20, 60)', // Crimson
        'Swamp': 'rgb(255, 20, 147)', // Deep Pink
        'Tower': 'rgb(255, 105, 180)', // Hot Pink
        'Trail': 'rgb(255, 182, 193)', // Light Pink
        'Tunnel': 'rgb(255, 160, 122)', // Light Salmon
        'Valley': 'rgb(250, 128, 114)', // Salmon
        'Well': 'rgb(233, 150, 122)', // Dark Salmon
        'Woods': 'rgb(139, 69, 19)' // Saddle Brown
      };

      useEffect(() => {
        if (showLandsat === true){
          if (landsatData.length === 0 || forceTerrainUpdate) {
            fetch("./geojson/G4_terrainLandsat.json")
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((json) => {
                // Function to get color from terrainColorMetricRef
                const getColorFromScale = (cVal) => {
                  const normalizedVal = Math.max(0, Math.min(cVal, 1));
                  const colorIndex = Math.floor(normalizedVal * (NDVI_COLOR_SCALE.length - 1));
                  return NDVI_COLOR_SCALE[colorIndex] ?? [255, 255, 255];
                };
        
                // Transform the data and use terrainColorMetricRef.current dynamically
                const l8DataFormatted = json.map((point) => ({
                  lon: point.centroid[0],   
                  lat: point.centroid[1],    
                  lstf_normalized: point.lstf_normalized,
                  ndvi: point.ndvi,
                  altitude: point.elv,
                  size: 1,
                  color: getColorFromScale(point[terrainColorMetricRef.current]), // ✅ Fixed
                }));
        
                setLandsatData(l8DataFormatted);
              })
              .catch((error) => console.error("Error loading point cloud data:", error));
          }
        };
      }, [showLandsat, landsatData, NDVI_COLOR_SCALE, forceTerrainUpdate]); 
    
      useEffect(() => {
        if (fieldPhotoPoints.length === 0) {
          fetch("./geojson/G4_fieldPhotos.json") // Replace with actual path to your JSON file
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Transform the data into the format required by Deck.gl
              const dFormatted = json.map((point) => ({
                lon: point.x,    // x -> longitude
                lat: point.y,    // y -> latitude
                altitude: point.z, // z -> altitude (height)
                size: point.size,  // optional: point size
                color: point.color // optional: point color (array of RGB values)
              }));
              setFieldPhotoPoints(dFormatted);
            })
            .catch((error) => console.error('Error loading point cloud data:', error));
        }
      }, [fieldPhotoPoints]);

      useEffect(() => {
        if (showParcels === true){
          if (parcelData === null) {
            fetch('./geojson/stratmap24-landparcels_48043_lp.geojson')
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(json => setParcelData(json.features))
              .catch(error => console.error('Error loading GeoJSON data:', error));
          }
        }
      }, [showParcels, parcelData]);



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    type UsgsFeature = {
        feature_id: string;
        lat: number;
        lon: number;
        elv: number;
        feature_name: string;
        feature_class: string;
        county_name: string;
        color: [number, number, number];
      };
      
    useEffect(() => {
        load('./csv/TX_Features_20200501.csv', CSVLoader)
          .then((csv_usgsFeatures) => {
            const rows = csv_usgsFeatures.data || csv_usgsFeatures;
      
            if (!Array.isArray(rows)) {
              console.error('CSV data is not an array:', rows);
              return;
            }
      
            const filteredUsgsFeatures = rows
              .filter((d: any) => {
                if (!d || typeof d !== 'object') {
                  console.warn('Skipping invalid row:', d);
                  return false;
                }
                return d.FEATURE_CLASS && (usgsFeatureKey === 'ALL' || String(d.FEATURE_CLASS).trim() === String(usgsFeatureKey).trim());
              })
              .map((d: any) => {
                const featureClass = String(d.FEATURE_CLASS || 'Unknown').trim();
                const colorString = usgsFeatureColors[featureClass] || 'rgb(128, 128, 128)'; // Default to gray if not found
                const colorArray = colorString.match(/\d+/g)?.map(Number) as [number, number, number];
      
                return {
                  feature_id: String(d.FEATURE_ID || ''),
                  feature_name: String(d.FEATURE_NAME || 'Unknown'),
                  feature_class: featureClass,
                  county_name: String(d.COUNTY_NAME || 'Unknown'),
                  lat: parseFloat(d.PRIM_LAT_DEC) || 0,
                  lon: parseFloat(d.PRIM_LONG_DEC) || 0,
                  elv: parseFloat(d.ELEV_IN_FT) || 0,
                  color: colorArray
                };
              });
      
            console.log('Filtered Features:', filteredUsgsFeatures);
            setUsgsFeatureData(filteredUsgsFeatures);
          })
          .catch((error) => console.error('Error loading CSV data:', error));
      }, [usgsFeatureKey]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // Import the layers from DeckTerrain
    const terrainLayers = useDeckTerrainLayers({
        terrainOpacity,
        terrainPointRadius,
        landsatData,
        showLandsat,
        terrainColorMetric: terrainColorMetricRef.current, // Use ref
        fieldPhotoPoints,
        showFieldPhotoPoints,
        COLOR_SCALE,
    }, [forceTerrainUpdate]);

    // Import the layers from DeckParcels
    const parcelLayers = useDeckParcels({
        parcelData,
        showParcels,
        setParcelTooltip
    });

    const usgsFeaturesLayer = useDeckUsgsFeatures({
        usgsFeatureData,
        showUsgsFeatures,
        usgsFeaturePointSize,
        usgsFeaturePointOpacity
    });

    // Combine all layers
    const layers = [...terrainLayers, ...parcelLayers, ...usgsFeaturesLayer];

    // Toggle auto-rotation
    const handleRotationToggle = () => {
        setIsRotating((prev) => !prev);
    };

    const [isCollapsedLeft, setIsCollapsedLeft] = useState(false);
    const togglePanelLeft = () => {
        setIsCollapsedLeft((prevState) => !prevState);
    };

    const [isCollapsedLegendPanel, setIsCollapsedLegendPanel] = useState(false);
    const toggleLegendPanel = () => {
      setIsCollapsedLegendPanel((prevState) => !prevState);
    };

    return (
        <div>
        <DeckGL
            layers={layers}
            viewState={viewState}
            controller={true}
            effects={[lightingEffect]}
            onViewStateChange={({ viewState }) => setViewState(viewState)}
        >
            <Map reuseMaps mapStyle={MAP_STYLE} />
        </DeckGL>
        <div className={`controlpanel ${isCollapsedLeft ? 'collapsed' : ''}`}>
            <button className="toggle-button" onClick={togglePanelLeft}>{isCollapsedLeft ? '⮜' : '⮞'}</button>
            {!isCollapsedLeft && (<></>)}
        </div>
        {parcelTooltip && (
            <div
                className="tooltip"
                style={{
                    position: "absolute",
                    left: parcelTooltip.x,
                    top: parcelTooltip.y,
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    pointerEvents: "none",
                }}
                >
                <b>Property ID:</b> {parcelTooltip.content.id} <br />
                <b>Owner:</b> {parcelTooltip.content.owner} <br />
                <b>Legal Desc:</b> {parcelTooltip.content.description}
            </div>
        )}
        {/* Render the Control Panel */}
        <ControlPanel
            showLandsat={showLandsat}
            onShowLandsatChange={setShowLandsat}
            terrainColorMetric={terrainColorMetricRef.current}
            onTerrainColorMetricChange={handleTerrainColorMetricChange}
            terrainOpacity={terrainOpacity}
            onTerrainOpacityChange={setTerrainOpacity}
            terrainPointRadius={terrainPointRadius}
            onTerrainPointRadiusChange={setTerrainPointRadius}
            showFieldPhotoPoints={showFieldPhotoPoints}
            onShowFieldPhotoPointsChange={setShowFieldPhotoPoints}
            isRotating={isRotating}
            onRotationToggle={handleRotationToggle}
            isCollapsed={isCollapsed}
            onCollapsedToggle={() => setIsCollapsed((prev) => !prev)}
            showParcels={showParcels}
            onShowParcelsChange={setShowParcels}
            onUsgsFeatureChange={setUsgsFeatureKey}
            showUsgsFeatures={showUsgsFeatures}
            onShowUsgsFeaturesChange={setShowUsgsFeatures}
            onUsgsFeaturePointSizeChange={setUsgsFeaturePointSize}
            OnUsgsFeaturePointOpacityChange={setUsgsFeaturePointOpacity}

            />
          <div className={`legendpanel ${isCollapsedLegendPanel ? 'collapsed' : ''}`}>
            <button className="toggle-button-legendpanel" onClick={toggleLegendPanel}>
                {isCollapsedLegendPanel ? '⮜' : '⮞'}
                </button>
                {!isCollapsedLegendPanel && (
                <>
                    <div>
                        <h3>Legends</h3>
                    </div>
                </>
            )}
            <LegendUsgsFeatures />
            <br />
        </div>
      </div>
    );
};
//<LegendVegetation />
export default DeckLayers;
