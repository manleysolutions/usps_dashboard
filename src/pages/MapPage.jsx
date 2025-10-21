import React, { useEffect, useState } from "react";
import MapView from "../components/MapView.jsx";

export default function MapPage() {
  const [sites, setSites] = useState([]);
  useEffect(()=>{ fetch("/api/usps/sites").then(r=>r.json()).then(setSites); },[]);
  return (
    <div className="main-content">
      <div className="section-header">
        <div className="section-title">Network Map</div>
        <div className="section-subtitle">25 pilot locations (color-coded by status)</div>
      </div>
      <MapView sites={sites} />
    </div>
  );
}
