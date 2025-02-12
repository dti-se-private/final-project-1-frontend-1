import React, {useEffect} from 'react';
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import L from "leaflet";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationPicker(props: {
    position: { lat: number, lng: number },
    onChangePosition: (position: L.LatLng) => void;
}) {
    const MapClickHandler = () => {
        useMapEvents({
            click: (e) => {
                props.onChangePosition(e.latlng)
            },
        });
        return null;
    };

    const FlyMapTo = () => {
        const map = useMap()
        useEffect(() => {
            map.flyTo(props.position);
        }, [props.position])
        return null
    }

    return (
        <>
            <MapContainer
                center={props.position}
                zoom={25}
                style={{height: '400px', width: '100%', "zIndex": 0}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler/>
                <FlyMapTo/>
                {props.position && <Marker position={props.position}></Marker>}
            </MapContainer>
            <div className="flex flex-row justify-between mt-4">
                <p>Latitude: {props.position?.lat}</p>
                <p>Longitude: {props.position?.lng}</p>
            </div>
        </>
    );
};
