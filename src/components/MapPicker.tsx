import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

export const MapPicker = ({ value, onSelect }) => {
  return (
      <MapContainer
          center={value || { lat: 44.4268, lng: 26.1025 }}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {value && <Marker position={value} icon={icon} />}
        <LocationMarker onSelect={onSelect} />
      </MapContainer>
  );
};