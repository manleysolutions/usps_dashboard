import React, { useEffect, useState } from "react";

export default function Staging() {
  const [devices, setDevices] = useState([]);
  const [progress, setProgress] = useState(null);
  const [busy, setBusy] = useState(false);

  const headers = { "Content-Type":"application/json" };

  const refresh = ()=>{
    fetch("/api/devices").then(r=>r.json()).then(setDevices);
    fetch("/api/staging/progress").then(r=>r.json()).then(setProgress);
  };
  useEffect(()=>{ refresh(); }, []);

  const register = async (payload)=>{
    await fetch("/api/staging/register",{ method:"POST", headers, body: JSON.stringify(payload) });
  };
  const assign = async (device_id, site_id)=>{
    await fetch("/api/staging/assign",{ method:"PUT", headers, body: JSON.stringify({ device_id, site_id }) });
  };
  const configure = async (device_id)=>{
    await fetch(`/api/staging/configure/${device_id}`,{ method:"POST" });
  };

  async function importCSV(file){
    setBusy(true);
    const text = await file.text();
    const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
    const headersCSV = headerLine.split(",").map(s=>s.trim());
    let ok = 0, fail = 0;
    for(const line of rows){
      const cols = line.split(",").map(s=>s.trim());
      const obj = {};
      headersCSV.forEach((h,i)=> obj[h] = cols[i] || "");
      try{
        await register({
          device_id: obj.device_id,
          type: obj.type,
          sku: obj.sku,
          imei: obj.imei,
          serial: obj.serial,
          iccid: obj.iccid,
          site_id: obj.site_id
        });
        ok++;
      }catch{ fail++; }
    }
    setBusy(false);
    alert(`Import complete. OK: ${ok}, Failed: ${fail}`);
    refresh();
  }

  return (
    <div className="content">
      <div className="topbar">
        <h1>3PL Staging</h1>
        <a className="btn" href="/customer">Customer View</a>
      </div>

      {progress && (
        <div className="status-cards" style={{marginBottom:16}}>
          <div className="card">Total: {progress.total}</div>
          <div className="card">Scanned: {progress.scanned}</div>
          <div className="card">Configured: {progress.configured}</div>
          <div className="card">Validated: {progress.validated}</div>
        </div>
      )}

      <div className="card">
        <h3>Import CSV</h3>
        <p className="hint">Headers: <code>device_id,type,sku,imei,serial,iccid,site_id</code></p>
        <input type="file" accept=".csv" onChange={e=>e.target.files[0] && importCSV(e.target.files[0])} disabled={busy}/>
      </div>

      <div className="card" style={{marginTop:16}}>
        <h3>Quick Register</h3>
        <RegisterForm onSubmit={async (p)=>{ await register(p); refresh(); }} />
      </div>

      <h3 style={{marginTop:16}}>Devices</h3>
      <table className="table">
        <thead><tr><th>ID</th><th>Type</th><th>Site</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {devices.map(d=>(
            <tr key={d.device_id}>
              <td>{d.device_id}</td>
              <td>{d.type}</td>
              <td><AssignForm initial={d.site_id||""} onAssign={async (site)=>{ await assign(d.device_id, site); refresh(); }}/></td>
              <td>{d.status}</td>
              <td><button onClick={async()=>{ await configure(d.device_id); refresh(); }}>Configure</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegisterForm({ onSubmit }){
  const [v, setV] = useState({ device_id:"", type:"inseego_fx3110", sku:"", imei:"", serial:"", iccid:"", site_id:"" });
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit(v); }}>
      <div className="grid-3">
        <input placeholder="device_id" value={v.device_id} onChange={e=>setV({...v, device_id:e.target.value})}/>
        <select value={v.type} onChange={e=>setV({...v, type:e.target.value})}>
          <option value="inseego_fx3110">Inseego FX3110</option>
          <option value="cisco_ata191">Cisco ATA 191</option>
          <option value="oem_ata">OEM ATA</option>
          <option value="rtl_csa">RTL/CSA</option>
        </select>
        <input placeholder="sku" value={v.sku} onChange={e=>setV({...v, sku:e.target.value})}/>
        <input placeholder="imei" value={v.imei} onChange={e=>setV({...v, imei:e.target.value})}/>
        <input placeholder="serial" value={v.serial} onChange={e=>setV({...v, serial:e.target.value})}/>
        <input placeholder="iccid" value={v.iccid} onChange={e=>setV({...v, iccid:e.target.value})}/>
        <input placeholder="site_id (USPS-001)" value={v.site_id} onChange={e=>setV({...v, site_id:e.target.value})}/>
      </div>
      <button className="btn" style={{marginTop:8}}>Register</button>
    </form>
  );
}

function AssignForm({ initial, onAssign }){
  const [site, setSite] = useState(initial);
  return (
    <span>
      <input style={{width:120}} placeholder="USPS-001" value={site} onChange={e=>setSite(e.target.value)}/>
      <button className="btn" onClick={()=>onAssign(site)} style={{marginLeft:6}}>Assign</button>
    </span>
  );
}
