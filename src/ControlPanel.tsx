import React from "react";

type ControlPanelProps = {
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
  onShowParcelsChange: (checked: boolean) => void;
  showLandsat: boolean;
  onShowLandsatChange: (checked: boolean) => void;
  terrainColorMetric: string;
  onTerrainColorMetricChange: (value: string) => void;
  usgsFeatureData: string;
  onUsgsFeatureChange: (value: string) => void;
  showUsgsFeatures: string;
  onShowUsgsFeaturesChange: (checked: boolean) => void;
  usgsFeaturePointSize: number;
  onUsgsFeaturePointSizeChange: (value: number) => void;
  usgsFeaturePointOpacity: number;
  onUsgsFeaturePointOpacityChange: (value: number) => void;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
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
  showLandsat,
  onShowLandsatChange,
  terrainColorMetric,
  onTerrainColorMetricChange,
  usgsFeatureData,
  onUsgsFeatureChange,
  showUsgsFeatures,
  onShowUsgsFeaturesChange,
  usgsFeaturePointSize,
  onUsgsFeaturePointSizeChange,
  usgsFeaturePointOpacity,
  OnUsgsFeaturePointOpacityChange
  
}) => {

  const usgsFeatureKeys = [
    'ALL',
    'Airport','Arch','Area','Arroyo','Bar','Basin','Bay',
    'Beach','Bench','Bend','Bridge','Building','Canal',
    'Cape','Cemetery','Census','Channel','Church','Civil',
    'Cliff','Crater','Crossing','Dam','Falls','Flat',
    'Forest','Gap','Gut','Harbor','Hospital','Island',
    'Lake','Levee','Locale','Military','Mine','Oilfield',
    'Park','Pillar','Plain','Populated Place','Post Office',
    'Range','Rapids','Reserve','Reservoir','Ridge','School',
    'Sea','Slope','Spring','Stream','Summit','Swamp',
    'Tower','Trail','Tunnel','Valley','Well','Woods'];


  return (
    <div className={`summarypanel ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-button-statspanel" onClick={onCollapsedToggle}>
        {isCollapsed ? "⮜" : "⮞"}
      </button>

      {!isCollapsed && (
        <div className="controlpanel">
          <div className="controlpanel-title"></div>
          <label>Terrain</label>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showLandsat}
                onChange={(e) => onShowLandsatChange(e.target.checked)}
              />
              Landsat
            </label>
          </div>
          <div className="control-slider">
            <label>
              Terrain Opacity {terrainOpacity}
              <input
                type="range"
                min="0.001"
                max="0.1"
                step="0.001"
                value={terrainOpacity}
                onChange={(e) => onTerrainOpacityChange(Number(e.target.value))}
              />
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
          <div className="control-dropdown-container">
            <div className="control-dropdown">
              <label>
                Terrain Color
                <select
                  value={terrainColorMetric}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue !== terrainColorMetric) {
                      onTerrainColorMetricChange(newValue);
                    }
                  }}
                >
                  {["altitude", "lstf_normalized", "ndvi"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <br/>
          <label>Field Photo Locations</label>
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
          <br/>
          <label>Parcels</label>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showParcels}
                onChange={(e) => onShowParcelsChange(e.target.checked)}
              />
              Show Parcels
            </label>
          </div>
          <br/>
          <label>USGS Features</label>
          <div className="control-dropdown">
            <label>
              <input
                type="checkbox"
                checked={showUsgsFeatures}
                onChange={(e) => onShowUsgsFeaturesChange(e.target.checked)}
              />
              Show Features
            </label>
          </div>
          <div className="control-slider">
            <label>
              Point Size {usgsFeaturePointSize}
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={usgsFeaturePointSize}
                onChange={(e) => onUsgsFeaturePointSizeChange(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="control-slider">
            <label>
              Opacity {usgsFeaturePointOpacity}
              <input
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={usgsFeaturePointOpacity}
                onChange={(e) => OnUsgsFeaturePointOpacityChange(Number(e.target.value))}
              />
            </label>
          </div>
          <br/>
          <div className="control-dropdown-container">
            <div className="control-dropdown">
              <label>
                <select
                  value={usgsFeatureData}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue !== usgsFeatureData) {
                      onUsgsFeatureChange(newValue);
                    }
                  }}
                >
                  {usgsFeatureKeys.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <br />
          <label>
            <input type="checkbox" checked={isRotating} onChange={onRotationToggle} />
            Rotate View
          </label>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
