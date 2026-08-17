import React from "react";
import ReactDOM from "react-dom/client";
import "./storage.js"; // precisa vir ANTES do EnglishRoad, cria window.storage
import EnglishRoad from "./EnglishRoad.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EnglishRoad />
  </React.StrictMode>
);
