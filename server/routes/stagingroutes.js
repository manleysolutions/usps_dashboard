import { Router } from "express";
import { authRequired, roleAny } from "../utils/guard.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildManifestPDF } from "../utils/pdf.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

const pData = (f) => path.join(__dirname, "..", "data", f);
const read = (f) => JSON.parse(fs.readFileSync(pData(f), "utf8"));
const write = (f, data) => fs.writeFileSync(pData(f), JSON.stringify(data, null, 2), "utf8");

// Register/scan device
router.post("/register", authRequired, roleAny("SuperAdmin", "3PL"), (req, res) => {
  const { device_id, type, sku, imei, serial, iccid, site_id, label } = req.body || {};
  if (!device_id || !type) return res.status(400).json({ message: "device_id and type required" });

  const devices = read("devices.json");
  const exists = devices.find(d => d.device_id === device_id);
  if (exists) return res.status(409).json({ message: "Already registered" });

  devices.push({ device_id, type, sku, imei, serial, iccid, site_id: site_id || null, label: label || device_id, status: "Scanned" });
  write("devices.json", devices);

  const log = read("staging_log.json");
  log.push({ op:"scan", device_id, by: req.user.sub, ts: new Date().toISOString() });
  write("staging_log.json", log);

  res.json({ ok: true });
});

// Assign to site
router.put("/assign", authRequired, roleAny("SuperAdmin", "3PL"), (req, res) => {
  const { device_id, site_id } = req.body || {};
  const devices = read("devices.json");
  const d = devices.find(x => x.device_id === device_id);
  if (!d) return res.status(404).json({ message: "Device not found" });
  d.site_id = site_id;
  d.status = "Assigned";
  write("devices.json", devices);

  const log = read("staging_log.json");
  log.push({ op:"assign", device_id, site_id, by: req.user.sub, ts: new Date().toISOString() });
  write("staging_log.json", log);

  res.json({ ok: true });
});

// Configure (stub)
router.post("/configure/:id", authRequired, roleAny("SuperAdmin","3PL"), (req,res)=>{
  const devices = read("devices.json");
  const d = devices.find(x=>x.device_id===req.params.id);
  if (!d) return res.status(404).json({ message: "Device not found" });
  d.status = "Configured";
  write("devices.json", devices);

  const log = read("staging_log.json");
  log.push({ op:"configure", device_id:req.params.id, by:req.user.sub, ts:new Date().toISOString() });
  write("staging_log.json", log);

  res.json({ ok:true });
});

// Validate (stub ping + SIP reg check)
router.get("/validate/:id", authRequired, roleAny("SuperAdmin","3PL"), (req,res)=>{
  // Return a fake pass with timestamps
  res.json({ device_id:req.params.id, passed:true, rssi_dbm:-65, sip:"Registered", ts:new Date().toISOString() });
});

// Manifest PDF by site
router.get("/manifest/:site_id", authRequired, roleAny("SuperAdmin","3PL"), (req,res)=>{
  const sites = read("sites.json");
  const devices = read("devices.json").filter(d => d.site_id === req.params.site_id);
  const site = sites.find(s => s.site_id === req.params.site_id);
  if (!site) return res.status(404).json({ message:"Site not found" });

  const progress = { total: devices.length, scanned: devices.length, configured: devices.filter(d=>d.status!=="Scanned").length, validated: Math.floor(devices.length*0.6), shipped: 0 };
  const doc = buildManifestPDF({ site, devices, progress });

  res.setHeader("Content-Type","application/pdf");
  res.setHeader("Content-Disposition",`attachment; filename=manifest_${site.site_id}.pdf`);
  doc.pipe(res);
});

router.get("/progress", authRequired, roleAny("SuperAdmin","3PL"), (_req,res)=>{
  const devices = read("devices.json");
  res.json({
    total: devices.length,
    scanned: devices.filter(d=>d.status==="Scanned" || d.status==="Assigned" || d.status==="Configured").length,
    configured: devices.filter(d=>d.status==="Configured").length,
    validated: Math.floor(devices.length*0.6),
    shipped: 0
  });
});

export default router;
