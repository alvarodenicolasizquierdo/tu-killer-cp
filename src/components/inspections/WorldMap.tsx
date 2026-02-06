import { memo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import { motion } from 'framer-motion';

// World map topojson from Natural Earth
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'at-risk' | 'critical';
  inspectionCount: number;
  hasCritical: boolean;
}

interface WorldMapProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
}

const WorldMap = memo(({ markers, onMarkerClick }: WorldMapProps) => {
  const getStatusColor = (status: 'active' | 'at-risk' | 'critical') => {
    switch (status) {
      case 'active': return '#10b981'; // emerald-500
      case 'at-risk': return '#f59e0b'; // amber-500
      case 'critical': return '#ef4444'; // red-500
    }
  };

  return (
    <ComposableMap
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    >
      <ZoomableGroup center={[80, 20]} zoom={1.5}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: 'hsl(var(--muted-foreground) / 0.3)' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Factory markers */}
        {markers.map((marker, index) => (
          <Marker
            key={marker.id}
            coordinates={[marker.lng, marker.lat]}
            onClick={() => onMarkerClick(marker.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* Pulse animation for critical */}
            {marker.hasCritical && (
              <motion.circle
                r={15}
                fill="none"
                stroke="#ef4444"
                strokeWidth={2}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 2.5 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            
            {/* Main marker */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <circle
                r={8}
                fill={getStatusColor(marker.status)}
                opacity={0.9}
              />
              <circle
                r={4}
                fill="white"
                opacity={0.9}
              />
              
              {/* Inspection count badge */}
              {marker.inspectionCount > 0 && (
                <>
                  <circle
                    cx={7}
                    cy={-7}
                    r={6}
                    fill="hsl(var(--primary))"
                  />
                  <text
                    x={7}
                    y={-4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {marker.inspectionCount}
                  </text>
                </>
              )}
            </motion.g>
            
            {/* Factory label */}
            <text
              y={18}
              textAnchor="middle"
              className="fill-foreground"
              style={{ fontSize: '8px', fontWeight: 500 }}
            >
              {marker.name.length > 18 ? marker.name.slice(0, 18) + '...' : marker.name}
            </text>
          </Marker>
        ))}
      </ZoomableGroup>
    </ComposableMap>
  );
});

WorldMap.displayName = 'WorldMap';

export default WorldMap;
