import { useMemo } from "react";
import { PointCloudLayer } from "@deck.gl/layers";

export const useDeckTerrainLayers = ({
  terrainOpacity,
  terrainPointRadius,
  landsatData = [],
  showLandsat,
  terrainColorMetric,
  fieldPhotoPoints = [],
  showFieldPhotoPoints,
  COLOR_SCALE
}) => {
  
  //console.log(terrainColorMetric);
  return useMemo(() => [
    // Landsat Scatterplot
    new PointCloudLayer({
      id: "pcl-terrain",
      data: landsatData,
      visible: showLandsat,
      getPosition: (d) => [d.lon, d.lat, d.altitude],
      getColor: (d) =>  d.color,
      //getRadius: 0.001,
      pointSize:terrainPointRadius,
      //radiusScale: .5,
      //radiusMinPixels: 0.001,
      //radiusMaxPixels: 0.01,
      opacity: terrainOpacity,
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
    terrainOpacity, terrainPointRadius,
    landsatData, showLandsat, terrainColorMetric,
    fieldPhotoPoints, showFieldPhotoPoints, COLOR_SCALE,
  ]);
};
