import { useMemo } from "react";
import { PointCloudLayer, ScatterplotLayer } from "@deck.gl/layers";

export const useDeckTerrainLayers = ({
  terrainData,
  showTerrainData,
  terrainOpacity,
  terrainPointRadius,
  landsatData,
  showLandsatData,
  fieldPhotoPoints,
  showFieldPhotoPoints,
  COLOR_SCALE
}) => {
  return useMemo(() => [
    // Terrain Point Cloud
    new PointCloudLayer({
      id: "point-cloud-layer",
      data: terrainData,
      visible: showTerrainData,
      getPosition: (d) => [d.lon, d.lat, d.altitude],
      getColor: (d) => d.color || [0, 0, 0],
      getRadius: terrainPointRadius || 1,
      radiusScale: 1,
      radiusMinPixels: 0.001,
      radiusMaxPixels: 5,
      opacity: terrainOpacity,
    }),

    // Landsat Scatterplot
    new ScatterplotLayer({
      id: "points-landsat",
      data: landsatData,
      visible: showLandsatData,
      pickable: true,
      autoHighlight: true,
      radiusScale: 1,
      radiusMinPixels: 5,
      radiusMaxPixels: 10,
      getRadius: 0.01,
      getPosition: (d) => [d.lon, d.lat, d.altitude],
      getFillColor: (d) => {
        const lstf = d.lstf ?? 0;
        const colorIndex = Math.round(lstf * (COLOR_SCALE.length - 1));
        return COLOR_SCALE[colorIndex];
      },
    }),

    // Field Photo Points
    new PointCloudLayer({
      id: "pcl-fieldPhotoPoints",
      data: fieldPhotoPoints,
      visible: showFieldPhotoPoints,
      getPosition: (d) => [d.lon, d.lat, d.altitude + 100],
      getColor: [255, 0, 255],
      getRadius: .5,
      radiusScale: 1,
      radiusMinPixels: 1,
      radiusMaxPixels: 1,
      opacity: .5,
    }),
  ], [
    terrainData, showTerrainData, terrainOpacity, terrainPointRadius,
    landsatData, showLandsatData,
    fieldPhotoPoints, showFieldPhotoPoints, COLOR_SCALE
  ]);
};
