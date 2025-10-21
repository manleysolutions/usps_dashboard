import React, { useEffect, useState } from "react";

const TelnyxMetrics = ({ metrics = {} }) => {
  const [data, setData] = useState(metrics);

  useEffect(() => {
    setData(metrics || {});
  }, [metrics]);

  return (
    <div className="card">
      <h3>Telnyx Metrics</h3>
      <table className="table">
        <tbody>
          <tr><td>Active Calls</td><td>{data.active_calls || 0}</td></tr>
          <tr><td>Average Latency</td><td>{data.latency || "23ms"}</td></tr>
          <tr><td>Packet Loss</td><td>{data.packet_loss || "0.2%"}</td></tr>
          <tr><td>Jitter</td><td>{data.jitter || "1.1ms"}</td></tr>
        </tbody>
      </table>
    </div>
  );
};

// Export both named and default
export default TelnyxMetrics;
export { TelnyxMetrics };
