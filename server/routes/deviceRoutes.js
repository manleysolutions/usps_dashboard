import { Router } from "express";
import { authRequired, roleAny } from "../utils/guard.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
const read = (f) => JSON.parse(fs.readFileSync(path.join(__dirname,"..","data",f),"utf8"));

router.get("/:id", authRequired, roleAny("SuperAdmin","Admin","Manager","User"), (req,res)=>{
  const d = read("devices.json").find(x=>x.device_id===req.params.id);
  if (!d) return res.status(404).json({ message:"Device not found" });

  // Stub telemetry depending on type
  const telemetry = d.type.includes("inseego")
    ? { rssi_dbm:-65, rsrp_dbm:-93, ip:"162.190.64.73", carrier:"T-Mobile", uptime_s: 86400 }
    : d.type.includes("ata")
    ? { sip:"Registered", last_call_ok:true }
    : { edge_online:true };

  res.json({ ...d, telemetry });
});

router.get("/", authRequired, roleAny("SuperAdmin","Admin","Manager","User","3PL"), (_req,res)=>{
  res.json(read("devices.json"));
});

export default router;
