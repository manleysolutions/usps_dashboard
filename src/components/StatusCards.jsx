import React, { useEffect, useState } from "react";

export default function StatusCards() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div className="status-cards">
      <div className="card">SIP: {data.sip}</div>
      <div className="card">CSA: {data.csa}</div>
      <div className="card">Modem: {data.modem}</div>
      <div className="card">Portal: {data.portal}</div>
    </div>
  );
}
