import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Ops from "./pages/Ops.jsx";
import Customer from "./pages/Customer.jsx";
import Staging from "./pages/Staging.jsx";
import Devices from "./pages/Devices.jsx";
import MapPage from "./pages/MapPage.jsx";
import Schedule from "./pages/Schedule.jsx";
import SyncStatus from "./pages/SyncStatus.jsx";
import SiteDetail from "./pages/SiteDetail.jsx";
import DeviceDetail from "./pages/DeviceDetail.jsx";

export default createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/ops", element: <Ops /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/customer", element: <Customer /> },
  { path: "/3pl", element: <Staging /> },
  { path: "/devices", element: <Devices /> },
  { path: "/map", element: <MapPage /> },
  { path: "/schedule", element: <Schedule /> },
  { path: "/sync_status", element: <SyncStatus /> },
  { path: "/site/:id", element: <SiteDetail /> },
  { path: "/device/:id", element: <DeviceDetail /> }
]);
