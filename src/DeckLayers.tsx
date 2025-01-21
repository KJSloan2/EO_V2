// DeckLayers.tsx
import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { Map } from "react-map-gl/maplibre";
import { useDeckTerrainLayers } from "./DeckTerrain"; // Import extracted layers
import ControlPanel from "./ControlPanel";
import './App.css';

const POI = [29.33837260928762, -103.59965184419559, 500];
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

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

    const [terrainData, setTerrainData] = useState([]);
    const [showTerrainData, setShowTerrainData] = useState(false);

    const [landsatData, setLandsatData] = useState([]);
    const [showLandsatData, setShowLandsatData] = useState(false);
  
    const [fieldPhotoPoints, setFieldPhotoPoints] = useState([]);
    const [showFieldPhotoPoints, setShowFieldPhotoPoints] = useState(false);

    const COLOR_SCALE = [
        [65, 182, 196, 255], [127, 205, 187, 255], [199, 233, 180, 255],
        [237, 248, 177, 255], [255, 255, 204, 255], [255, 237, 160, 255],
        [254, 217, 118, 255], [254, 178, 76, 255], [253, 141, 60, 255],
        [252, 78, 42, 255], [227, 26, 28, 255], [189, 0, 38, 255],
        [128, 0, 38, 255]
      ];
    
      useEffect(() => {
        if (terrainData.length === 0) {
          fetch('./geojson/G4_3DEP_ptCloud.json') // Replace with actual path to your JSON file
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Transform the data into the format required by Deck.gl
              const terrainDataFormatted = json.map((point) => ({
                lon: point.x,    // x -> longitude
                lat: point.y,    // y -> latitude
                altitude: point.z, // z -> altitude (height)
                size: point.size,  // optional: point size
                color: point.color // optional: point color (array of RGB values)
              }));
              setTerrainData(terrainDataFormatted);
            })
            .catch((error) => console.error('Error loading point cloud data:', error));
        }
      }, [terrainData]);
    
      useEffect(() => {
        if (landsatData.length === 0) {
          fetch("./geojson/G4_2023.json") // Replace with actual path to your JSON file
            .then((response) => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then((json) => {
              // Transform the data into the format required by Deck.gl
              const l8DataFormatted = json.map((point) => ({
                lon: point.centroid[0],    // x -> longitude
                lat: point.centroid[1],    // y -> latitude
                lstf: point.lstf,
                ndvi: point.ndvi,
                altitude: 1,
                size: 1,
                color: [point.r, point.g , point.b]
              }));
              setLandsatData(l8DataFormatted);
            })
            .catch((error) => console.error('Error loading point cloud data:', error));
        }
      }, [landsatData]);
    
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

    // Import the layers from DeckTerrain
    const layers = useDeckTerrainLayers({
        terrainData,
        showTerrainData,
        terrainOpacity,
        terrainPointRadius,
        landsatData,
        showLandsatData: false,
        fieldPhotoPoints,
        showFieldPhotoPoints,
        COLOR_SCALE,
    });

    // Toggle auto-rotation
    const handleRotationToggle = () => {
        setIsRotating((prev) => !prev);
    };

    return (
        <div>
        <DeckGL
            layers={layers}
            viewState={viewState}
            controller={true}
            onViewStateChange={({ viewState }) => setViewState(viewState)}
        >
            <Map reuseMaps mapStyle={MAP_STYLE} />
        </DeckGL>
        {/* Render the Control Panel */}
        <ControlPanel
            showTerrainData={showTerrainData}
            onShowTerrainDataChange={setShowTerrainData}
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
            />
        </div>
    );
    };

    export default DeckLayers;
