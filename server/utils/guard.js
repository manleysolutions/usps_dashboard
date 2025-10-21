import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "true911secretkey";

export function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid/expired token" });
  }
}

export function roleAny(...roles) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(403).json({ message: "Forbidden" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
