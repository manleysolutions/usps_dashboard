import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import Login from "./pages/Login.jsx";
import Ops from "./pages/Ops.jsx";
import Customer from "./pages/Customer.jsx";
import Staging from "./pages/Staging.jsx";
import SiteDetail from "./pages/SiteDetail.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ops" element={<Ops />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/site/:id" element={<SiteDetail />} />
        <Route path="/3pl" element={<Staging />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
