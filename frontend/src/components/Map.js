import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 55.7558, // Широта вашего салона
  lng: 37.6173, // Долгота вашего салона
};

const MyLocationMap = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBjlIBH4t75Sq2YnK8odO7Af79zqYov74c">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
        {/* Размещение маркера на карте */}
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyLocationMap;
