import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Crosshair, AlertCircle } from 'lucide-react';

// Fix standard Leaflet icon paths in bundler environments
const customIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="
    background: #087EBC;
    width: 24px;
    height: 24px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid #FFFFFF;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    position: relative;
  "><div style="
    width: 8px;
    height: 8px;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 5px;
  "></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

interface LocationPickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat,
  initialLng,
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Wagholi, Pune coordinates default
  const defaultLat = initialLat || 18.5793;
  const defaultLng = initialLng || 73.9812;

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: defaultLat,
    lng: defaultLng,
  });
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 14,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([defaultLat, defaultLng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setSelectedCoords({ lat: pos.lat, lng: pos.lng });
      onLocationChange(pos.lat, pos.lng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setSelectedCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      onLocationChange(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Invalidate size after container renders
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const { latitude, longitude } = position.coords;
        setSelectedCoords({ lat: latitude, lng: longitude });
        onLocationChange(latitude, longitude);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
      },
      (error) => {
        setGeoLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied. You can tap directly on the map to pin the incident.');
        } else {
          setGeoError('Unable to detect location. Please select the spot on the map.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetWagholi = () => {
    const lat = 18.5793;
    const lng = 73.9812;
    setSelectedCoords({ lat, lng });
    onLocationChange(lat, lng);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 14);
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold text-[#103B54] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#087EBC]" />
          <span>Pin Incident Location on Map (Optional)</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={geoLoading}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 bg-sky-50 text-[#087EBC] rounded-lg border border-sky-200 hover:bg-sky-100 transition-colors disabled:opacity-50"
          >
            <Navigation className={`w-3 h-3 ${geoLoading ? 'animate-spin' : ''}`} />
            <span>{geoLoading ? 'Locating...' : 'Use Current GPS'}</span>
          </button>
          <button
            type="button"
            onClick={handleResetWagholi}
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Crosshair className="w-3 h-3" />
            <span>Reset Wagholi</span>
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs z-10">
        <div ref={mapContainerRef} className="h-60 sm:h-64 w-full bg-slate-100" />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Click or drag pin to adjust coordinates</span>
        <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
          {selectedCoords.lat.toFixed(4)}° N, {selectedCoords.lng.toFixed(4)}° E
        </span>
      </div>

      {geoError && (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{geoError}</span>
        </div>
      )}
    </div>
  );
};
