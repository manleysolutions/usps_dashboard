# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

USPS Dashboard - Local dev + Render

1) Ensure dependencies:
   npm install

2) Build the frontend:
   npm run build

3) Start server (serves dist + mock API):
   npm start
   -> http://localhost:10000

Data:
 - Example seed file: ./data/seed.json
 - To replace fake data with a real feed:
    * Replace ./data/seed.json contents with your export format OR
    * Modify server.js to fetch from DB or external service (replace-load/save helpers)
 - server.js persists small changes back to data/seed.json for quick dev.

API highlights (mock):
 - GET /api/usps/sites
 - POST /api/usps/sites
 - GET /api/devices
 - POST /api/devices
 - PUT /api/devices/:id/assign  { site_id: 'USPS-001' }
 - POST /api/staging/register   { device_id, type, sku, serial, imei, iccid, site_id }
 - GET /api/telnyx/cdr
 - GET /api/devices/summary
