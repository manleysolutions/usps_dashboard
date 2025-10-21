import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "true911secretkey";

// Demo users
const users = [
  { username: "superadmin", pass: bcrypt.hashSync("true911", 8), role: "SuperAdmin", account: "Ops" },
  { username: "usps-admin", pass: bcrypt.hashSync("admin123", 8), role: "Admin", account: "USPS" },
  { username: "usps-manager", pass: bcrypt.hashSync("manager123", 8), role: "Manager", account: "USPS" },
  { username: "usps-user", pass: bcrypt.hashSync("user123", 8), role: "User", account: "USPS" },
  { username: "3pl", pass: bcrypt.hashSync("stage123", 8), role: "3PL", account: "USPS" }
];

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const u = users.find(x => x.username === username);
  if (!u) return res.status(401).json({ message: "User not found" });
  if (!bcrypt.compareSync(password, u.pass)) return res.status(401).json({ message: "Invalid password" });
  const token = jwt.sign({ sub: username, role: u.role, account: u.account }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, role: u.role, account: u.account });
});

export default router;
