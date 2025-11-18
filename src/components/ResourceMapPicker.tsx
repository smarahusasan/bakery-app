import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export const ResourceMapPicker = ({ resources, onSelect }) => {

    return (
        <MapContainer
            center={resources[0]?.location || { lat: 44.4268, lng: 26.1025 }}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {resources.map(item => item.location && (
                <Marker key={item.id} position={item.location} icon={icon}>
                    <Popup>
                        <b>{item.name}</b><br/>
                        <button onClick={() => onSelect(item)}>Select</button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};