// src/components/Map.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyLocationMap = () => {
  const position = [55.7558, 37.6176]; // Примерные координаты для Москвы

  return (
    <MapContainer center={position} zoom={13} style={{ width: '100%', height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          Мы находимся здесь!
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyLocationMap;
