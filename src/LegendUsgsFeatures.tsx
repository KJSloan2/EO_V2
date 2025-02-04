import React from "react";

const COLOR_KEY = {
  'Airport': { rgb: 'rgb(255, 69, 0)' }, // Orange-Red
  'Arch': { rgb: 'rgb(255, 140, 0)' }, // Dark Orange
  'Area': { rgb: 'rgb(255, 215, 0)' }, // Gold
  'Arroyo': { rgb: 'rgb(218, 165, 32)' }, // Goldenrod
  'Bar': { rgb: 'rgb(184, 134, 11)' }, // Dark Goldenrod
  'Basin': { rgb: 'rgb(189, 183, 107)' }, // Dark Khaki
  'Bay': { rgb: 'rgb(0, 255, 255)' }, // Cyan
  'Beach': { rgb: 'rgb(70, 130, 180)' }, // Steel Blue
  'Bench': { rgb: 'rgb(176, 196, 222)' }, // Light Steel Blue
  'Bend': { rgb: 'rgb(30, 144, 255)' }, // Dodger Blue
  'Bridge': { rgb: 'rgb(0, 191, 255)' }, // Deep Sky Blue
  'Building': { rgb: 'rgb(135, 206, 235)' }, // Sky Blue
  'Canal': { rgb: 'rgb(64, 224, 208)' }, // Turquoise
  'Cape': { rgb: 'rgb(32, 178, 170)' }, // Light Sea Green
  'Cemetery': { rgb: 'rgb(0, 128, 0)' }, // Green
  'Census': { rgb: 'rgb(50, 205, 50)' }, // Lime Green
  'Channel': { rgb: 'rgb(34, 139, 34)' }, // Forest Green
  'Church': { rgb: 'rgb(107, 142, 35)' }, // Olive Drab
  'Civil': { rgb: 'rgb(189, 183, 107)' }, // Dark Khaki
  'Cliff': { rgb: 'rgb(128, 128, 0)' }, // Olive
  'Crater': { rgb: 'rgb(139, 69, 19)' }, // Saddle Brown
  'Crossing': { rgb: 'rgb(165, 42, 42)' }, // Brown
  'Dam': { rgb: 'rgb(210, 105, 30)' }, // Chocolate
  'Falls': { rgb: 'rgb(205, 133, 63)' }, // Peru
  'Flat': { rgb: 'rgb(244, 164, 96)' }, // Sandy Brown
  'Forest': { rgb: 'rgb(34, 139, 34)' }, // Forest Green
  'Gap': { rgb: 'rgb(85, 107, 47)' }, // Dark Olive Green
  'Gut': { rgb: 'rgb(152, 251, 152)' }, // Pale Green
  'Harbor': { rgb: 'rgb(0, 100, 0)' }, // Dark Green
  'Hospital': { rgb: 'rgb(255, 0, 255)' }, // Magenta
  'Island': { rgb: 'rgb(153, 50, 204)' }, // Dark Orchid
  'Lake': { rgb: 'rgb(75, 0, 130)' }, // Indigo
  'Levee': { rgb: 'rgb(147, 112, 219)' }, // Medium Purple
  'Locale': { rgb: 'rgb(123, 104, 238)' }, // Medium Slate Blue
  'Military': { rgb: 'rgb(106, 90, 205)' }, // Slate Blue
  'Mine': { rgb: 'rgb(72, 61, 139)' }, // Dark Slate Blue
  'Oilfield': { rgb: 'rgb(0, 0, 139)' }, // Dark Blue
  'Park': { rgb: 'rgb(0, 0, 205)' }, // Medium Blue
  'Pillar': { rgb: 'rgb(25, 25, 112)' }, // Midnight Blue
  'Plain': { rgb: 'rgb(240, 230, 140)' }, // Khaki
  'Populated Place': { rgb: 'rgb(255, 222, 173)' }, // Navajo White
  'Post Office': { rgb: 'rgb(210, 180, 140)' }, // Tan
  'Range': { rgb: 'rgb(160, 82, 45)' }, // Sienna
  'Rapids': { rgb: 'rgb(255, 250, 205)' }, // Lemon Chiffon
  'Reserve': { rgb: 'rgb(250, 250, 210)' }, // Light Goldenrod Yellow
  'Reservoir': { rgb: 'rgb(255, 239, 213)' }, // Papaya Whip
  'Ridge': { rgb: 'rgb(255, 228, 181)' }, // Moccasin
  'School': { rgb: 'rgb(255, 218, 185)' }, // Peach Puff
  'Sea': { rgb: 'rgb(245, 222, 179)' }, // Wheat
  'Slope': { rgb: 'rgb(139, 0, 0)' }, // Dark Red
  'Spring': { rgb: 'rgb(178, 34, 34)' }, // Fire Brick
  'Stream': { rgb: 'rgb(205, 92, 92)' }, // Indian Red
  'Summit': { rgb: 'rgb(220, 20, 60)' }, // Crimson
  'Swamp': { rgb: 'rgb(255, 20, 147)' }, // Deep Pink
  'Tower': { rgb: 'rgb(255, 105, 180)' }, // Hot Pink
  'Trail': { rgb: 'rgb(255, 182, 193)' }, // Light Pink
  'Tunnel': { rgb: 'rgb(255, 160, 122)' }, // Light Salmon
  'Valley': { rgb: 'rgb(250, 128, 114)' }, // Salmon
  'Well': { rgb: 'rgb(233, 150, 122)' }, // Dark Salmon
  'Woods': { rgb: 'rgb(139, 69, 19)' } // Saddle Brown
};

const LegendUsgsFeatures = () => {
  return (
    <div style={{ textAlign: "left", height: "25vh", overflow: "auto" }}>
      <label>USGS Feature</label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.1em"
        }}
      >
        {Object.entries(COLOR_KEY).map(([name, { rgb }]) => {
          return (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".5em"
              }}
            >
              {/* Color Bar */}
              <div
                style={{
                  backgroundColor: rgb,
                  width: "2em",
                  height: ".75em"
                }}
              ></div>
              {/* Color Name */}
              <span style={{color: "#ffffff" ,fontSize: ".75em" }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LegendUsgsFeatures;
