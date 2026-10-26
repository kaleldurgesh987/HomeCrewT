import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Star, ShieldCheck, Zap, Navigation } from 'lucide-react';

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG HTML icon generator for Workers
const createWorkerIcon = (worker) => {
  const isVerified = worker.verificationStatus === 'verified';
  const isUnder30 = worker.isUnder30Min;

  const html = `
    <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background-color: #0B5D43;
        border: 2.5px solid ${isUnder30 ? '#F9B000' : '#FFFFFF'};
        box-shadow: 0 4px 12px rgba(11, 93, 67, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        <img src="${worker.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}" 
             style="width: 100%; height: 100%; object-fit: cover;" 
             alt="${worker.user?.name || 'Worker'}" />
      </div>
      ${
        isVerified
          ? `<div style="
              position: absolute;
              bottom: -2px;
              right: -2px;
              background: #F9B000;
              color: #0B5D43;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              font-weight: bold;
              border: 1.5px solid #FFFFFF;
            ">✓</div>`
          : ''
      }
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-worker-leaflet-pin',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
};

// Custom SVG HTML icon generator for Customer Location
const createCustomerIcon = () => {
  const html = `
    <div style="
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #1E293B;
      border: 3px solid #FAFBF8;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FAFBF8;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F9B000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-customer-leaflet-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

// Component to recenter map when center coordinates change
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
};

// Component to handle user clicking map to pick coordinates
const LocationPickerHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect([e.latlng.lng, e.latlng.lat]);
      }
    },
  });
  return null;
};

export const LeafletMap = ({
  center = [19.0760, 72.8777], // Default: Mumbai
  zoom = 12,
  workers = [],
  customerLocation = null, // [lat, lng]
  interactivePin = null, // [lng, lat]
  onLocationSelect = null,
  routePolyline = null, // array of [lat, lng]
  onWorkerSelect = null,
  height = '400px',
}) => {
  const mapCenter = customerLocation
    ? [customerLocation[1], customerLocation[0]]
    : center;

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-2xl overflow-hidden shadow-soft border border-gray-200">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <MapUpdater center={mapCenter} zoom={zoom} />
        {onLocationSelect && <LocationPickerHandler onLocationSelect={onLocationSelect} />}

        {/* Free OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Customer Location Marker */}
        {customerLocation && (
          <Marker
            position={[customerLocation[1], customerLocation[0]]}
            icon={createCustomerIcon()}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <span className="font-bold text-gray-800">Your Location</span>
                <p className="text-gray-500 mt-0.5">Service destination</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Interactive Selected Location Pin (e.g. posting a job) */}
        {interactivePin && (
          <Marker
            position={[interactivePin[1], interactivePin[0]]}
            icon={createCustomerIcon()}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <span className="font-bold text-brand-green-700">Selected Job Location</span>
                <p className="text-gray-500 mt-0.5">Workers will arrive here</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Workers Markers */}
        {workers.map((worker) => {
          const coords = worker.currentLocation?.coordinates || [72.8777, 19.0760];
          const pos = [coords[1], coords[0]];

          return (
            <Marker
              key={worker._id || worker.user?._id}
              position={pos}
              icon={createWorkerIcon(worker)}
              eventHandlers={{
                click: () => onWorkerSelect && onWorkerSelect(worker),
              }}
            >
              <Popup>
                <div className="p-2 min-w-[210px] font-sans">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={worker.user?.avatar}
                      alt={worker.user?.name}
                      className="w-10 h-10 rounded-full object-cover border border-brand-green-400"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm text-gray-900 leading-tight">
                          {worker.user?.name}
                        </span>
                        {worker.verificationStatus === 'verified' && (
                          <ShieldCheck className="w-4 h-4 text-brand-green-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-brand-green-700 font-semibold">
                        {worker.skills?.slice(0, 2).join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-t border-b border-gray-100 text-xs mb-2">
                    <span className="font-extrabold text-brand-green-900">
                      ₹{worker.hourlyRate}
                      <span className="font-normal text-gray-500">/hr</span>
                    </span>
                    <span className="flex items-center gap-0.5 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {worker.avgRating || 4.8}
                    </span>
                  </div>

                  {worker.etaFormatted && (
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-500">Arrival Time:</span>
                      <span
                        className={`font-bold flex items-center gap-1 ${
                          worker.isUnder30Min ? 'text-amber-600' : 'text-gray-700'
                        }`}
                      >
                        {worker.isUnder30Min && <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />}
                        {worker.etaFormatted}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => onWorkerSelect && onWorkerSelect(worker)}
                    className="w-full py-1.5 bg-brand-green-700 hover:bg-brand-green-800 text-white rounded-lg text-xs font-heading font-semibold tracking-wide transition-colors"
                  >
                    View & Book Pro &rarr;
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Polyline for live transit */}
        {routePolyline && routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#0B5D43',
              weight: 5,
              opacity: 0.85,
              dashArray: '8, 8',
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
