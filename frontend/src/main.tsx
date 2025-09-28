import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { VariablesProvider } from "./context/VariablesContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VariablesProvider>
      <App />
    </VariablesProvider>
  </React.StrictMode>
);

