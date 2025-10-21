import React, { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapView({ sites = [], statusColors = {} }) {
  const center = useMemo(() => {
    if (!sites.length) return [37.8, -96]; // US center
    const lat = sites.reduce((a,b)=>a+b.lat,0) / sites.length;
    const lng = sites.reduce((a,b)=>a+b.lng,0) / sites.length;
    return [lat, lng];
  }, [sites]);

  return (
    <div className="map-view">
      <h3 style={{marginBottom:8}}>Deployment Map</h3>
      <MapContainer center={center} zoom={5} style={{ height: 420, width: "100%", borderRadius: 10 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {sites.map((s) => (
          <CircleMarker
            key={s.site_id}
            center={[s.lat, s.lng]}
            radius={8}
            pathOptions={{ color: statusColors[s.status] || "#7dd3fc", fillColor: statusColors[s.status] || "#7dd3fc", fillOpacity: 0.9 }}
          >
            <Popup>
              <b>{s.name}</b><br/>
              {s.address}<br/>
              Status: <span style={{color:statusColors[s.status]||"#fff"}}>{s.status}</span>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
