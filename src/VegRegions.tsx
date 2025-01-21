import React from "react";

const COLOR_SCALE = {
  'Tobosa - Black Grama Grassland': { hex: '#feface' },
  'Blue Grama - Buffalograss Grassland': { hex: '#eee58c' },
  'Bluestem Grassland': { hex: '#a4d38d' },
  'Silver Bluestem - Texas Wintergrass Grassland': { hex: '#fcebcc' },
  'Yucca - Ocotillo Shrub': { hex: '#ed2024' },
  'Creosotebush - Tarbush Shrub': { hex: '#f9beca' },
  'Creosotebush - Lechuguilla Shrub': { hex: '#f47e6f' },
  'Creosotebush - Mesquite Shrub': { hex: '#f48c9e' },
  'Fourwing Saltbush - Creosotebush Shrub': { hex: '#fed600' },
  'Ceniza - Blackbrush - Creosotebush Brush': { hex: '#faa31b' },
  'Mesquite Shrub/Grassland': { hex: '#bcb66a' },
  'Mesquite Brush': { hex: '#eedd82' },
  'Mesquite - Lotebush Shrub': { hex: '#f06ba8' },
  'Mesquite - Lotebush Brush': { hex: '#ce8abc' },
  'Mesquite - Juniper Shrub': { hex: '#b4e1e4' },
  'Mesquite - Juniper - Live Oak Brush': { hex: '#adc3dd' },
  'Mesquite - Sandsage Shrub': { hex: '#a87b2c' },
  'Mesquite - Blackbrush Brush': { hex: '#ba908f' },
  'Mesquite - Granjeno Parks': { hex: '#6d8f3c' },
  'Mesquite - Granjeno Woods': { hex: '#cb853e' },
  'Mesquite - Saltcedar Brush/Woods': { hex: '#dcdedc' },
  'Mesquite - Hackberry Brush/Woods': { hex: '#c0bfbf' },
  'Mesquite - Live Oak - Bluewood Parks': { hex: '#9aca3c' },
  'Havard Shin Oak - Mesquite Brush': { hex: '#d2b48e' },
  'Sandsage - Mesquite Brush': { hex: '#dcb885' },
  'Oak - Mesquite - Juniper Parks/Woods': { hex: '#954c92' },
  'Live Oak - Mesquite Parks': { hex: '#9d5da6' },
  'Live Oak Woods/Parks': { hex: '#ce2690' },
  'Live Oak - Ashe Juniper Parks': { hex: '#b1e0e7' },
  'Live Oak - Mesquite - Ashe Juniper Parks': { hex: '#d2a0c9' },
  'Live Oak - Ashe Juniper Woods': { hex: '#50b848' },
  'Havard Shin Oak Brush': { hex: '#304f50' },
  'Gray Oak - Pinyon Pine - Alligator Juniper Parks/Woods': { hex: '#f5eb13' },
  'Post Oak Parks/Woods': { hex: '#b12424' },
  'Post Oak Woods, Forest, and Grassland Mosaic': { hex: '#f5f5db' },
  'Post Oak Woods/Forest': { hex: '#ce5b5b' },
  'Willow Oak - Water Oak - Blackgum Forest': { hex: '#6f8190' },
  'Sandsage - Havard Shin Oak Brush': { hex: '#f2634a' },
  'Ashe Juniper Parks/Woods': { hex: '#58c4c4' },
  'Juniper - Mixed Brush': { hex: '#8fbb90' },
  'Elm - Hackberry Parks/Woods': { hex: '#b4d334' },
  'Water Oak - Elm - Hackberry Forest': { hex: '#768799' },
  'Cottonwood - Hackberry - Saltcedar Brush/Woods': { hex: '#1db1aa' },
  'Pecan - Elm Forest': { hex: '#39c0c7' },
  'Bald Cypress - Water Tupelo Swamp': { hex: '#b0e0e6' },
  'Ponderosa Pine - Douglas Fir Parks/Forest': { hex: '#176333' },
  'Young Forest/Grassland': { hex: '#6cc286' },
  'Pine - Hardwood Forest': { hex: '#98d4be' },
  'Marsh/Barrier Island': { hex: '#6eccdd' },
  'Crops': { hex: '#f5ddb1' },
  'Other Native and/or Introduced Grasses': { hex: '#f9f291' },
  'Urban': { hex: '#d4d2d3' },
  'Lakes': { hex: '#e2f4f8' }
};

const VegRegionsColorKey = () => {
  return (
    <div style={{ textAlign: "left", height: "25vh", "overflow": "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column", // Stack items vertically
          alignItems: "flex-start",
          gap: "0.1em" // Space between each color bar
        }}
      >
        {Object.entries(COLOR_SCALE).map(([name, { hex }]) => {
          const cssColor = hex; // Use the hex code for color
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center", // Align color and text
                gap: ".5em" // Space between color and text
              }}
            >
              {/* Color Bar */}
              <div
                style={{
                  backgroundColor: cssColor,
                  width: "2em", // Fixed width for color bar
                  height: ".75em" // Fixed height for color bar
                }}
              ></div>
              {/* Color Name */}
              <span style={{ fontSize: ".75em" }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VegRegionsColorKey;
