import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Devices() {
  const [q,setQ] = useState("");
  const [rows,setRows] = useState([]);

  const load = async (query="")=>{
    const url = query ? `/api/devices?q=${encodeURIComponent(query)}` : "/api/devices";
    const r = await fetch(url); setRows(await r.json());
  };
  useEffect(()=>{ load(); },[]);

  return (
    <div className="main-content">
      <div className="section-header">
        <div className="section-title">Devices</div>
        <div className="section-subtitle">Inseego, Cisco ATA, OEM ATA, CSA</div>
      </div>

      <div className="toolbar">
        <input placeholder="Search IMEI, serial, site…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={()=>load(q)}>Search</button>
        <Link className="btn" to="/3pl">3PL Staging</Link>
      </div>

      <table className="table-dark">
        <thead>
          <tr><th>Device</th><th>Type</th><th>Site</th><th>Status</th><th>Carrier/IMEI</th></tr>
        </thead>
        <tbody>
          {rows.map(d=>(
            <tr key={d.device_id}>
              <td><Link to={`/device/${d.device_id}`}>{d.device_id}</Link></td>
              <td>{d.type}</td>
              <td>{d.site_id||"—"}</td>
              <td>{d.status}</td>
              <td>{d.carrier||""} {d.imei?`(${d.imei})`:""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
