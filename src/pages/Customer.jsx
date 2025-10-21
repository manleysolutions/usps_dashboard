import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MapView from "../components/MapView.jsx";

const STATUS_COLORS = {
  Online: "#22c55e",     // green
  Pending: "#f59e0b",    // orange
  Offline: "#ef4444"     // red
};

export default function Customer() {
  const [sites, setSites] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/usps/sites").then(r => r.json()).then(setSites);
  }, []);

  const counts = useMemo(() => ({
    total: sites.length,
    online: sites.filter(s => s.status === "Online").length,
    pending: sites.filter(s => s.status === "Pending").length,
    offline: sites.filter(s => s.status === "Offline").length
  }), [sites]);

  const filtered = useMemo(() => {
    let list = sites;
    if (filter !== "All") list = list.filter(s => s.status === filter);
    if (q.trim()) {
      const qq = q.toLowerCase();
      list = list.filter(s =>
        (s.site_id + " " + s.name + " " + s.address).toLowerCase().includes(qq)
      );
    }
    return list;
  }, [sites, filter, q]);

  return (
    <div className="content">
      <div className="topbar">
        <h1>USPS – True911+ Deployment</h1>
        <div className="pillbar">
          <span className="pill">Total: {counts.total}</span>
          <span className="pill" style={{background:"#14313e"}}>Online: <b style={{color:STATUS_COLORS.Online}}>{counts.online}</b></span>
          <span className="pill" style={{background:"#3c2e12"}}>Pending: <b style={{color:STATUS_COLORS.Pending}}>{counts.pending}</b></span>
          <span className="pill" style={{background:"#3a1a1a"}}>Offline: <b style={{color:STATUS_COLORS.Offline}}>{counts.offline}</b></span>
        </div>
      </div>

      <div className="toolbar">
        <select value={filter} onChange={e=>setFilter(e.target.value)}>
          <option>All</option>
          <option>Online</option>
          <option>Pending</option>
          <option>Offline</option>
        </select>
        <input placeholder="Search site, address…" value={q} onChange={e=>setQ(e.target.value)} />
        <Link to="/3pl" className="btn">3PL Staging</Link>
      </div>

      <div className="card" style={{marginBottom:16}}>
        <MapView sites={filtered} statusColors={STATUS_COLORS} />
      </div>

      <div className="card">
        <h3>Locations</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Site ID</th><th>Name</th><th>Address</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.site_id}>
                <td>{s.site_id}</td>
                <td>{s.name}</td>
                <td>{s.address}</td>
                <td style={{color: STATUS_COLORS[s.status] || "#ccc"}}>{s.status}</td>
                <td><Link to={`/site/${s.site_id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
