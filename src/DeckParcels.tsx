import { useMemo, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";

export const useDeckParcels = ({
  parcelData,
  showParcels,
  setParcelTooltip, // ✅ Pass function to update tooltip state in parent component
}) => {
  // Function to handle tooltip hover
  const handleTooltipHover = (info) => {
    if (info.layer && info.layer.id === "geojson-parcels" && info.object) {
      const { x, y, object } = info;
      setParcelTooltip({
        x,
        y,
        content: {
          id: object.properties.Prop_ID || "N/A",
          owner: object.properties.OWNER_NAME || "N/A",
          description: object.properties.LEGAL_DESC || "N/A",
        },
      });
    } else {
      setParcelTooltip(null);
    }
  };

  return useMemo(
    () => [
      new GeoJsonLayer({
        id: "geojson-parcels",
        visible: showParcels,
        data: parcelData,
        opacity: 1,
        stroked: true,
        filled: true,
        extruded: false,
        wireframe: true,
        getElevation: 5,
        getLineColor: [255, 255, 255],
        getFillColor: [255, 209, 0, 50],
        getLineWidth: 2,
        pickable: true,
        shadowEnabled: false,
        onHover: handleTooltipHover, // ✅ Corrected function reference
      }),
    ],
    [parcelData, showParcels]
  );
};
