import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  let { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapLat, mapLng] = useUrlPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );
  // Ensure cities is an array
  if (!cities) cities = [];

  // Memoize the city markers to prevent re-renders
  const cityMarkers = useMemo(() => {
    return cities.map((city) => (
      <Marker position={[city.position.lat, city.position.lng]} key={city._id}>
        <Popup>
          <span>{city.emoji}</span> <span>{city.cityName}</span>
        </Popup>
      </Marker>
    ));
  }, [cities]);

  // Memoize the position button to prevent re-renders
  const positionButton = useMemo(() => {
    if (geolocationPosition) return null;
    return (
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "Loading..." : "Use your position"}
      </Button>
    );
  }, [geolocationPosition, isLoadingPosition, getPosition]);

  return (
    <div className={styles.mapContainer}>
      {positionButton}

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cityMarkers}

        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  // Use useCallback to memoize the click handler
  const handleClick = useCallback(
    (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
    [navigate]
  );

  useMapEvents({
    click: handleClick,
  });

  return null;
}

// Wrap the Map component with React.memo to prevent unnecessary re-renders
export default React.memo(Map);
