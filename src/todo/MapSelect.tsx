import React, {useEffect, useState} from "react";
import {MapContainer, TileLayer, Marker, useMapEvents, useMap} from "react-leaflet";

interface MapSelectProps {
    initialLat?: number;
    initialLng?: number;
    onSelect: (lat: number, lng: number) => void;
}

const MapResizeFix = () => {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100);
    }, [map]);
    return null;
};

export const MapSelect: React.FC<MapSelectProps> = ({ initialLat, initialLng, onSelect }) => {
    const [markerPos, setMarkerPos] = useState<[number, number]>(
        initialLat && initialLng ? [initialLat, initialLng] : [45.75, 21.23]
    );

    const MapClick = () => {
        useMapEvents({
            click(e) {
                setMarkerPos([e.latlng.lat, e.latlng.lng]);
                onSelect(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    };

    return (
        <div style={{ width: "300px", height: "200px", border: "1px solid #ccc", borderRadius: "8px", overflow: "hidden", float: "right", margin: "10px" }}>
            <MapContainer
                center={markerPos}
                zoom={13}
                style={{ width: "100%", height: "100%" }}
                scrollWheelZoom={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={markerPos} />
                <MapClick />
                <MapResizeFix/>
            </MapContainer>
        </div>
    );
};
