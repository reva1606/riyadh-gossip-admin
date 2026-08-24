"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

// Leaflet's default marker icon references relative image paths that break
// under bundlers — point it at the copies in public/leaflet/ instead (see
// node_modules/leaflet/dist/images, copied there once at setup time).
const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Riyadh — sensible default center when no location has been picked yet.
const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function LocationMapPicker({ latitude, longitude, onChange }: LocationMapPickerProps) {
  const position: [number, number] | null =
    latitude != null && longitude != null ? [latitude, longitude] : null;

  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-border">
      <MapContainer
        center={position ?? DEFAULT_CENTER}
        zoom={position ? 14 : 11}
        scrollWheelZoom={false}
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {position && (
          <Marker
            position={position}
            icon={markerIcon}
            draggable
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = event.target.getLatLng();
                onChange(lat, lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
