import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { extractCoords } from "../utils/helpers.js";

// Fix default marker icons (Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Blue marker = your current location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points || points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 16);
      return;
    }
    map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 16 });
  }, [map, points]);
  return null;
}

function formatDistance(meters) {
  if (meters == null) return null;
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds) {
  if (seconds == null) return null;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h} h ${m} min` : `${h} h`;
}

export default function MapView({ result }) {
  const coords = extractCoords(result);
  const [userLocation, setUserLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState("idle");
  const [geoError, setGeoError] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);

  const address =
    result?.cleaned_address ||
    result?.formatted_address ||
    result?.address ||
    "Destination";

  // Get current location
  useEffect(() => {
    if (!coords) return;
    if (!navigator.geolocation) {
      setGeoStatus("error");
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setGeoStatus("loading");
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setGeoStatus("success");
      },
      (err) => {
        setGeoStatus("error");
        const messages = {
          1: "Location permission denied. Allow location access to see directions.",
          2: "Unable to determine your location.",
          3: "Location request timed out.",
        };
        setGeoError(
          messages[err.code] || err.message || "Could not get your location"
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  }, [coords?.lat, coords?.lon]);

  // Fetch route from OSRM (no leaflet-routing-machine needed)
  useEffect(() => {
    if (!coords || !userLocation) {
      setRoute(null);
      return;
    }

    let cancelled = false;
    setRouteLoading(true);
    setRouteError(null);

    const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lon},${userLocation.lat};${coords.lon},${coords.lat}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Route request failed");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data.code !== "Ok" || !data.routes?.[0]) {
          throw new Error(data.message || "No route found");
        }
        const r = data.routes[0];
        const coordinates = r.geometry.coordinates.map(([lon, lat]) => [
          lat,
          lon,
        ]);
        setRoute({
          coordinates,
          distance: r.distance,
          duration: r.duration,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setRouteError(err.message || "Could not load route");
          setRoute(null);
        }
      })
      .finally(() => {
        if (!cancelled) setRouteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coords?.lat, coords?.lon, userLocation?.lat, userLocation?.lon]);

  const points = useMemo(() => {
    const list = [];
    if (userLocation) list.push([userLocation.lat, userLocation.lon]);
    if (coords) list.push([coords.lat, coords.lon]);
    return list;
  }, [userLocation, coords]);

  if (!coords) {
    return (
      <div className="card">
        <div className="card-title">Map & Directions</div>
        <p style={{ color: "#94a3b8" }}>
          No coordinates available to display map.
        </p>
      </div>
    );
  }

  const position = [coords.lat, coords.lon];

  const googleMapsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${coords.lat},${coords.lon}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lon}&travelmode=driving`;

  return (
    <div className="card">
      <div className="card-title">Map & Directions</div>

      <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
        {geoStatus === "loading" && (
          <p style={{ color: "#64748b" }}>Getting your current location…</p>
        )}
        {geoStatus === "error" && (
          <p style={{ color: "#b91c1c" }}>{geoError}</p>
        )}
        {geoStatus === "success" && userLocation && (
          <div style={{ color: "#334155" }}>
            <p style={{ marginBottom: "0.35rem" }}>
              <strong>From:</strong> Your current location (
              {userLocation.lat.toFixed(5)}, {userLocation.lon.toFixed(5)})
            </p>
            <p style={{ marginBottom: "0.35rem" }}>
              <strong>To:</strong> {address}
            </p>
            {routeLoading && (
              <p style={{ color: "#64748b" }}>Calculating route…</p>
            )}
            {routeError && <p style={{ color: "#b91c1c" }}>{routeError}</p>}
            {route && (
              <p style={{ marginTop: "0.25rem" }}>
                <strong>Distance:</strong> {formatDistance(route.distance)}
                {" · "}
                <strong>Est. time:</strong> {formatDuration(route.duration)}
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "0.85rem" }}>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{
            textDecoration: "none",
            display: "inline-flex",
            fontSize: "0.9rem",
            padding: "0.55rem 1rem",
          }}
        >
          Open directions in Google Maps
        </a>
      </div>

      <div className="map-container">
        <MapContainer
          center={position}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds points={points} />

          {/* Destination (red) */}
          <Marker position={position}>
            <Popup>
              <strong>Destination</strong>
              <br />
              {address}
            </Popup>
          </Marker>

          {/* You are here (blue) */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={userIcon}
            >
              <Popup>
                <strong>You are here</strong>
              </Popup>
            </Marker>
          )}

          {/* Route line */}
          {route?.coordinates?.length > 1 && (
            <Polyline
              positions={route.coordinates}
              pathOptions={{ color: "#2563eb", weight: 5, opacity: 0.75 }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}