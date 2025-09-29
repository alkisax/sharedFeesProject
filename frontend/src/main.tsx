import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { VariablesProvider } from "./context/VariablesContext";
import { UserProvider } from './context/UserAuthContext'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VariablesProvider>
      <UserProvider>
        <App />        
      </UserProvider>
    </VariablesProvider>
  </React.StrictMode>
);

