import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./ReactViews/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);