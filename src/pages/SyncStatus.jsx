import React, { useEffect, useState } from "react";

export default function SyncStatus(){
  const [logs,setLogs] = useState([]);

  const load = async ()=> {
    const r = await fetch("/api/sync/logs");
    setLogs(await r.json());
  };

  useEffect(()=>{ load(); },[]);

  return (
    <div className="main-content">
      <div className="section-header">
        <div className="section-title">Portal Sync Status</div>
        <div className="section-subtitle">Latest uploads by site / reporter (device or portal)</div>
      </div>

      <table className="table-dark">
        <thead><tr><th>Time (UTC)</th><th>Site</th><th>Reporter</th><th>Component</th><th>Result</th><th>Message</th></tr></thead>
        <tbody>
          {logs.slice().reverse().map(l=>(
            <tr key={l.id}>
              <td>{l.ts}</td>
              <td>{l.site_id}</td>
              <td>{l.reporter}</td>
              <td>{l.component}</td>
              <td>{l.result}</td>
              <td>{l.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
