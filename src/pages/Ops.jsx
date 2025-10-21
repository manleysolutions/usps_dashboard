import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { AlertsPanel } from "../components/AlertsPanel";
import DataTable from "../components/DataTable";
import TelnyxMetrics from "../components/Telnyxmetrics";
import MapView from "../components/MapView";
import "../App.css";

const Ops = () => {
  const [summary, setSummary] = useState({
    devices: 0,
    online: 0,
    degraded: 0,
    offline: 0,
    avgSignal: "-",
    batteryAlarms: 0,
  });

  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [cdrMetrics, setCdrMetrics] = useState({});
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetch("/api/devices/summary")
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});

    fetch("/api/alerts/active")
      .then((r) => r.json())
      .then(setAlerts)
      .catch(() => {});

    fetch("/api/devices/list")
      .then((r) => r.json())
      .then(setDevices)
      .catch(() => {});

    fetch("/api/telnyx/cdr")
      .then((r) => r.json())
      .then((data) => {
        setCdrMetrics(data.metrics || {});
        setCalls(data.calls || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="ops-container">
      <Header title="CSA Mission Control" user="SuperAdmin" role="superadmin" />

      <div className="summary-section">
        <p>Devices: {summary.devices}</p>
        <p>Online: {summary.online}</p>
        <p>Degraded: {summary.degraded}</p>
        <p>Offline: {summary.offline}</p>
        <p>Avg Signal: {summary.avgSignal} dBm</p>
        <p>Battery Alarms: {summary.batteryAlarms}</p>
      </div>

      <h2>Deployment Map</h2>
      <MapView />

      <h2>Active Alerts</h2>
      <AlertsPanel alerts={alerts} />

      <h2>Devices</h2>
      <DataTable data={devices} />

      <TelnyxMetrics metrics={cdrMetrics} calls={calls} />
    </div>
  );
};

export default Ops;
