import React from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import StatusCards from "../components/StatusCards.jsx";
import MapView from "../components/MapView.jsx";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Header />
      <div className="main">
        <Sidebar />
        <div className="content">
          <StatusCards />
          <MapView />
        </div>
      </div>
    </div>
  );
}
