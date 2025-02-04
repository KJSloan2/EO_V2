import { useMemo } from "react";
import { ScatterplotLayer } from "@deck.gl/layers";

export const useDeckUsgsFeatures = ({
    usgsFeatureData,
    showUsgsFeatures,
    usgsFeaturePointSize,
    usgsFeaturePointOpacity
}) => {

  console.log(usgsFeaturePointOpacity);
  return useMemo(() => [
    // Landsat Scatterplot
    new ScatterplotLayer({
        id: "usgsFeatures",
        data: usgsFeatureData,
        visible: showUsgsFeatures,
        pickable: true,
        autoHighlight: true,
        radiusScale: 1,
        radiusMinPixels: 0.01,
        radiusMaxPixels: 10,
        getRadius: usgsFeaturePointSize,
        getPosition: (d) => [d.lon, d.lat, d.altitude],
        getFillColor: (d) => d.color,
        opacity: usgsFeaturePointOpacity,
        /*getFillColor: (d) => {
          const lstf = d.lstf ?? 0;
          const colorIndex = Math.round(lstf * (COLOR_SCALE.length - 1));
          return COLOR_SCALE[colorIndex];
        },*/
      }),

  ], [
    usgsFeatureData,
    showUsgsFeatures,
    usgsFeaturePointSize,
    usgsFeaturePointOpacity,
  ]);
};
