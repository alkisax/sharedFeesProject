import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminExcelUploadPanel from '../components/AdminExcelUploadPanel'

const AdminLayout = () => {
  const [activePanel, setActivePanel] = useState("start");

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar onSelect={setActivePanel} />
      <main style={{ flexGrow: 1, padding: "16px" }}>

        {activePanel === "start" && <p>Start panel selected</p>}
        {activePanel === "excel" && <AdminExcelUploadPanel />}


        <Outlet />

      </main>
    </div>
  );
};

export default AdminLayout;
