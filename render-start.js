// render-start.js
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Adjusted path: this tells Render to run your real server file even if nested
const serverPath = join(__dirname, "usps_dashboard", "server.js");

// Launch your app
const child = spawn("node", [serverPath], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code));
