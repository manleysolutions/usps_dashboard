import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = ({ sites = [] }) => {
  const center = [37.8, -96.9]; // geographic center of US

  return (
    <div className="map-view">
      <MapContainer center={center} zoom={4} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site) => (
          <Marker key={site.site_id} position={[site.lat, site.lng]}>
            <Popup>
              <strong>{site.name}</strong>
              <br />
              {site.address || "No address"}
              <br />
              Status: {site.status || "Unknown"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Export both named and default
export default MapView;
export { MapView };

