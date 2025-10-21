import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DeviceDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [d, setD] = useState(null);

  useEffect(() => {
    fetch(`/api/device/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r=>r.json()).then(setD);
  }, [token, id]);

  if (!d) return <div className="content">Loading…</div>;

  return (
    <div className="content">
      <h2>{d.label || d.device_id}</h2>
      <div>Type: {d.type}</div>
      {d.telemetry && (
        <pre style={{background:"#fff", padding:12, borderRadius:8, marginTop:10}}>
          {JSON.stringify(d.telemetry, null, 2)}
        </pre>
      )}
    </div>
  );
}
