import React from "react";

/*const COLOR_SCALE = [
  [65, 182, 196, 1],
  [127, 205, 187, 1],
  [199, 233, 180, 1],
  [237, 248, 177, 1],
  [255, 255, 204, 1],
  [255, 237, 160, 1],
  [254, 217, 118, 1],
  [254, 178, 76, 1],
  [253, 141, 60, 1],
  [252, 78, 42, 1],
  [227, 26, 28, 1],
  [189, 0, 38, 1],
  [128, 0, 38, 1],
];*/

const COLOR_SCALE = [
  [65, 182, 196, 1],
  [255, 237, 160, 1],
  [254, 217, 118, 1],
  [254, 178, 76, 1],
  [253, 141, 60, 1],
  [252, 78, 42, 1],
  [227, 26, 28, 1]
];

const UCAColorScale = () => {
  return (
    <div style={{ textAlign: "left", width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "left",
          justifyContent: "space-between",
          width: "95%",
          padding: "5px",
        }}
      >
        {/* Color Bars */}
        {COLOR_SCALE.map((color, index) => {
          const [r, g, b, opacity] = color;
          const cssColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          return (
            <div
              key={index}
              style={{
                backgroundColor: cssColor,
                flex: 1,
                height: "20px",
                margin: "0 2px", // Small gap between bars
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default UCAColorScale;
