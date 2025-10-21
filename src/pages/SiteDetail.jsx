import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function SiteDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [sites, setSites] = useState([]);
  const [saving, setSaving] = useState(false);
  const site = useMemo(()=> sites.find(s=>s.site_id===id) || null, [sites, id]);

  // editable fields
  const [poc, setPoc] = useState({ name:"", phone:"", email:"" });
  const [verified, setVerified] = useState(false);
  const [installDate, setInstallDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(()=>{
    fetch("/api/usps/sites").then(r=>r.json()).then(data=>{
      setSites(data);
    });
  }, []);

  useEffect(()=>{
    if(site){
      setPoc(site.poc || {name:"", phone:"", email:""});
      setVerified(!!site.address_verified);
      const win = site.install_window || {};
      setInstallDate(win.date || "");
      setStartTime(win.start || "");
      setEndTime(win.end || "");
    }
  }, [site]);

  async function save(){
    if(!site) return;
    setSaving(true);
    const payload = {
      poc,
      address_verified: verified,
      install_window: { date: installDate, start: startTime, end: endTime }
    };
    await fetch(`/api/usps/sites/${site.site_id}`,{
      method:"PUT",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    setSaving(false);
    alert("Saved");
    nav("/customer");
  }

  if(!site) return <div className="content"><p>Loading…</p></div>;

  return (
    <div className="content">
      <div className="topbar">
        <h1>{site.site_id} — {site.name}</h1>
        <Link to="/customer" className="btn">Back</Link>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Address</h3>
          <p style={{margin:0}}>{site.address}</p>
          <label style={{display:"flex",gap:8,alignItems:"center",marginTop:10}}>
            <input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)} />
            Address Verified
          </label>
        </div>

        <div className="card">
          <h3>Point of Contact</h3>
          <div className="form-row">
            <label>Name</label>
            <input value={poc.name} onChange={e=>setPoc({...poc, name:e.target.value})} />
          </div>
          <div className="form-row">
            <label>Phone</label>
            <input value={poc.phone} onChange={e=>setPoc({...poc, phone:e.target.value})} />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input value={poc.email} onChange={e=>setPoc({...poc, email:e.target.value})} />
          </div>
        </div>

        <div className="card">
          <h3>Installer Scheduling</h3>
          <div className="form-row">
            <label>Date</label>
            <input type="date" value={installDate} onChange={e=>setInstallDate(e.target.value)} />
          </div>
          <div className="form-row">
            <label>Start</label>
            <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} />
          </div>
          <div className="form-row">
            <label>End</label>
            <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} />
          </div>
          <p className="hint">Manley/ Inseego scheduling can read this window and coordinate resources.</p>
        </div>
      </div>

      <button className="btn" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
    </div>
  );
}
