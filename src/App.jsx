import { useState } from 'react'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState("status")

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <header style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ color: "#004B87" }}>📡 USPS Demo Dashboard</h1>
        <p style={{ fontSize: "14px", color: "#333" }}>True911+ Pilot – Live System Overview</p>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        {["status", "logs", "tools"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              margin: "0 10px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: activeTab === tab ? "#004B87" : "#ccc",
              color: activeTab === tab ? "white" : "black",
              cursor: "pointer"
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "status" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <StatusCard title="SIP Status" status="✅ Registered" color="green" />
          <StatusCard title="ATA Status" status="✅ Online" color="green" />
          <StatusCard title="Modem Signal" status="📶 -65 dBm (Excellent)" />
          <StatusCard title="Portal Sync" status="✅ Connected" color="green" />
        </div>
      )}

      {activeTab === "logs" && (
        <div style={{ background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <h3>Event Log</h3>
          <ul>
            <li>[14:05] SIP Registered</li>
            <li>[14:06] ATA Online</li>
            <li>[14:07] Call Detected</li>
            <li>[14:09] Emergency Scenario Triggered 🚨</li>
          </ul>
        </div>
      )}

      {activeTab === "tools" && (
        <div style={{ background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
          <h3>Tools</h3>
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>🔄 Reboot</button>
          <button style={{ marginRight: "10px", padding: "10px 20px" }}>📡 Ping Device</button>
          <button style={{ padding: "10px 20px" }}>📑 Generate Report</button>
        </div>
      )}
    </div>
  )
}

function StatusCard({ title, status, color }) {
  return (
    <div style={{ padding: "15px", background: "white", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
      <h3>{title}</h3>
      <p style={{ color: color || "black" }}>{status}</p>
    </div>
  )
}
