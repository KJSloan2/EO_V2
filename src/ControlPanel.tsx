import React from "react";

type ControlPanelProps = {
  showTerrainData: boolean;
  onShowTerrainDataChange: (checked: boolean) => void;
  terrainOpacity: number;
  onTerrainOpacityChange: (value: number) => void;
  terrainPointRadius: number;
  onTerrainPointRadiusChange: (value: number) => void;
  showFieldPhotoPoints: boolean;
  onShowFieldPhotoPointsChange: (checked: boolean) => void;
  isRotating: boolean;
  onRotationToggle: () => void;
  isCollapsed: boolean;
  onCollapsedToggle: () => void;
  showParcels: boolean;
  onShowParcelsChange: () => void;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  showTerrainData,
  onShowTerrainDataChange,
  terrainOpacity,
  onTerrainOpacityChange,
  terrainPointRadius,
  onTerrainPointRadiusChange,
  showFieldPhotoPoints,
  onShowFieldPhotoPointsChange,
  isRotating,
  onRotationToggle,
  isCollapsed,
  onCollapsedToggle,
  showParcels,
  onShowParcelsChange,
}) => {
  return (
    <div className={`summarypanel ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button-statspanel" onClick={onCollapsedToggle}>
        {isCollapsed ? "⮜" : "⮞"}
      </button>

      {!isCollapsed && (
        <div className="controlpanel">
          <div className="controlpanel-title">Layers</div>
          <br />
          <label>Terrain</label>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showTerrainData}
                onChange={(e) => onShowTerrainDataChange(e.target.checked)}
              />
              Site 3Dep Terrain
            </label>
          </div>
          <div className="control-slider">
            <label>
              Terrain Opacity {terrainOpacity}
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={terrainOpacity}
                onChange={(e) => onTerrainOpacityChange(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showFieldPhotoPoints}
                onChange={(e) => onShowFieldPhotoPointsChange(e.target.checked)}
              />
              Field Photo Locations
            </label>
          </div>
          <div className="control-slider">
            <label>
              Terrain Point Radius {terrainPointRadius}
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={terrainPointRadius}
                onChange={(e) => onTerrainPointRadiusChange(Number(e.target.value))}
              />
            </label>
          </div>
          <br/>
          <label>Parcels</label>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showParcels}
                onChange={(e) => onShowParcelsChange(e.target.checked)}
              />
              Field Photo Locations
            </label>
          </div>
          <br/>
          <div className="color-scale-labels">
            <label>
              <input type="checkbox" checked={isRotating} onChange={onRotationToggle} />
              Rotate View
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
