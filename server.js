// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "server", "data");
const SEED_FILE = path.join(DATA_DIR, "seed.json");

async function loadSeed() {
  try {
    const raw = await fs.readFile(SEED_FILE, "utf8");
    const data = JSON.parse(raw);
    // shape guards
    return {
      sites: data.sites || [],
      devices: data.devices || [],
      users: data.users || [],
      telnyx: data.telnyx || { metrics: {}, calls: [] },
      staging: data.staging || { manifests: [], progress: { total:0, scanned:0, configured:0, validated:0 } },
      installations: data.installations || [],           // NEW
      syncLogs: data.syncLogs || []                      // NEW
    };
  } catch (e) {
    console.error("Failed to load seed.json:", e.message);
    return { sites:[], devices:[], users:[], telnyx:{}, staging:{manifests:[],progress:{}}, installations:[], syncLogs:[] };
  }
}
async function saveSeed(obj) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SEED_FILE, JSON.stringify(obj, null, 2), "utf8");
}

const app = express();
app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// In-memory store
let DB = await loadSeed();

// ---------- Sites ----------
app.get("/api/usps/sites", (_req, res) => res.json(DB.sites));
app.post("/api/usps/sites", async (req, res) => {
  const s = req.body;
  if (!s?.site_id) return res.status(400).json({error:"site_id required"});
  DB.sites.push(s);
  await saveSeed(DB);
  res.json(s);
});
app.put("/api/usps/sites/:id", async (req,res)=>{
  const i = DB.sites.findIndex(s=>s.site_id===req.params.id);
  if (i<0) return res.status(404).json({error:"not found"});
  DB.sites[i] = {...DB.sites[i], ...req.body};
  await saveSeed(DB);
  res.json(DB.sites[i]);
});

// ---------- Devices ----------
app.get("/api/devices", (req,res)=>{
  const q = (req.query.q||"").toString().toLowerCase();
  const data = q ? DB.devices.filter(d => JSON.stringify(d).toLowerCase().includes(q)) : DB.devices;
  res.json(data);
});
app.get("/api/devices/:id", (req,res)=>{
  const d = DB.devices.find(x=>x.device_id===req.params.id);
  if (!d) return res.status(404).json({error:"not found"});
  res.json(d);
});
app.post("/api/devices", async (req,res)=>{
  const d = req.body;
  if (!d?.device_id) return res.status(400).json({error:"device_id required"});
  DB.devices.push(d);
  await saveSeed(DB);
  res.json(d);
});
app.put("/api/devices/:id/assign", async (req,res)=>{
  const d = DB.devices.find(x=>x.device_id===req.params.id);
  if (!d) return res.status(404).json({error:"not found"});
  d.site_id = req.body.site_id || d.site_id;
  d.status = "Assigned";
  await saveSeed(DB);
  res.json(d);
});
app.post("/api/devices/:id/configure", async (req,res)=>{
  const d = DB.devices.find(x=>x.device_id===req.params.id);
  if (!d) return res.status(404).json({error:"not found"});
  d.status = "Configured";
  await saveSeed(DB);
  res.json({ok:true, device:d});
});

// ---------- 3PL / Staging ----------
app.get("/api/staging/progress", (_req,res)=> res.json(DB.staging?.progress || {total:0,scanned:0,configured:0,validated:0}));
app.post("/api/staging/register", async (req,res)=>{
  const p = req.body || {};
  DB.staging.manifests = DB.staging.manifests || [];
  DB.staging.manifests.push({ ts:new Date().toISOString(), ...p });

  if (p.device_id && !DB.devices.find(d=>d.device_id===p.device_id)) {
    DB.devices.push({ device_id:p.device_id, type:p.type||"unknown", sku:p.sku||"", imei:p.imei||"", serial:p.serial||"", iccid:p.iccid||"", site_id:p.site_id||"", status:"Staged" });
  }
  DB.staging.progress.total = (DB.staging.progress.total||0) + 1;
  DB.staging.progress.scanned = (DB.staging.progress.scanned||0) + 1;

  await saveSeed(DB);
  res.json({ok:true});
});

// ---------- Installations (Scheduling) ----------
/*
  installation object:
  {
    id: "inst-001",
    site_id: "USPS-001",
    window_start: "2025-10-28T14:00:00Z",
    window_end:   "2025-10-28T16:00:00Z",
    installer: { company:"Converge IoT", name:"Tech A", phone:"..." },
    status: "scheduled" | "in_progress" | "done" | "blocked",
    notes: "Gate code 1234"
  }
*/
app.get("/api/installations", (_req,res)=> res.json(DB.installations || []));
app.post("/api/installations", async (req,res)=>{
  const inst = req.body || {};
  inst.id = inst.id || `inst-${(DB.installations?.length||0)+1}`;
  DB.installations = DB.installations || [];
  DB.installations.push(inst);
  await saveSeed(DB);
  res.json(inst);
});
app.put("/api/installations/:id", async (req,res)=>{
  const i = (DB.installations||[]).findIndex(x=>x.id===req.params.id);
  if (i<0) return res.status(404).json({error:"not found"});
  DB.installations[i] = {...DB.installations[i], ...req.body};
  await saveSeed(DB);
  res.json(DB.installations[i]);
});

// ---------- Sync Logs (Portal/Device uploads) ----------
/*
  sync log:
  { id:"sync-001", ts:"ISO", site_id:"USPS-001", reporter:"FX3110-IMEI", component:"inseego|ata|csa|portal", result:"ok|warn|error", message:"..." }
*/
app.get("/api/sync/logs", (_req,res)=> res.json(DB.syncLogs || []));
app.post("/api/sync/logs", async (req,res)=>{
  const log = { id:`sync-${(DB.syncLogs?.length||0)+1}`, ts:new Date().toISOString(), ...req.body };
  DB.syncLogs = DB.syncLogs || [];
  DB.syncLogs.push(log);
  await saveSeed(DB);
  res.json(log);
});

// ---------- Summaries/Alerts ----------
app.get("/api/devices/summary", (_req,res)=>{
  const dev = DB.devices||[];
  const total = dev.length;
  const online = dev.filter(d=>["Online","Assigned","Configured"].includes(d.status)).length;
  const degraded = dev.filter(d=>d.status==="Degraded").length;
  const offline = dev.filter(d=>["Offline","Missing"].includes(d.status)).length;
  res.json({ devices:total, online, degraded, offline, avgSignal:-85, batteryAlarms:0 });
});
app.get("/api/alerts/active", (_req,res)=>{
  res.json([
    { id:"a-1", level:"critical", message:"Call dropped on line 2059641709" },
    { id:"a-2", level:"warning", message:"Jitter detected on SIP trunk" }
  ]);
});

// Fallback for SPA
app.get("*", (_req, res) => res.sendFile(path.join(distPath, "index.html")));

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log(`✅ USPS Dashboard running at http://localhost:${PORT}`));
