// render-start.js
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The correct path: server.js is in the same directory as this file
const serverPath = join(__dirname, "server.js");

// Launch your app
const child = spawn("node", [serverPath], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code));
