import { Router } from "express";
import { authRequired, roleAny } from "../utils/guard.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

function readJson(p) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", p), "utf8"));
}

router.get("/summary", authRequired, roleAny("SuperAdmin", "Admin", "Manager", "User"), (_req, res) => {
  const sites = readJson("sites.json");
  const devices = readJson("devices.json");
  const online = Math.floor(devices.length * 0.6);
  const pending = sites.filter(s => s.status === "Pending").length;
  res.json({ totals: { sites: sites.length, devices: devices.length }, online, pending });
});

router.get("/sites", authRequired, roleAny("SuperAdmin", "Admin", "Manager", "User"), (req, res) => {
  const sites = readJson("sites.json");
  const role = req.user.role;
  // For demo: Manager sees first 2, User sees first 1
  const filtered = role === "Manager" ? sites.slice(0,2) : role === "User" ? sites.slice(0,1) : sites;
  res.json(filtered);
});

router.get("/site/:site_id", authRequired, roleAny("SuperAdmin", "Admin", "Manager", "User"), (req, res) => {
  const sites = readJson("sites.json");
  const devices = readJson("devices.json");
  const site = sites.find(s => s.site_id === req.params.site_id);
  if (!site) return res.status(404).json({ message: "Site not found" });
  const siteDevices = devices.filter(d => d.site_id === site.site_id);
  res.json({ site, devices: siteDevices, telemetry: { uptime_pct_7d: 99.2, avg_rssi_dbm: -67 } });
});

router.get("/reports/:site_id", authRequired, roleAny("SuperAdmin","Admin","Manager","User"), (req,res)=>{
  // Stub: return CSV string
  const site_id = req.params.site_id;
  const csv = `metric,value\nsite_id,${site_id}\nuptime_pct_7d,99.2\navg_rssi_dbm,-67\n`;
  res.header("Content-Type","text/csv");
  res.attachment(`report_${site_id}.csv`);
  res.send(csv);
});

export default router;
