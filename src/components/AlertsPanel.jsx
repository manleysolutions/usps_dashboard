import React from "react";

const AlertsPanel = ({ alerts = [] }) => {
  return (
    <div className="alerts-panel">
      <h3>Active Alerts</h3>
      {alerts.length === 0 ? (
        <p>No active alerts.</p>
      ) : (
        <ul>
          {alerts.map((a) => (
            <li key={a.id} className={`alert-${a.level}`}>
              <strong>{a.level.toUpperCase()}:</strong> {a.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Export both forms to keep compatibility
export default AlertsPanel;
export { AlertsPanel };
