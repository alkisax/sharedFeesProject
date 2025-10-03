import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from '../components/AdmniSidebar';
import AdminExcelUploadPanel from '../components/AdminExcelUploadPanel'
import AdminBillsPanel from '../components/AdminBillsPanel'
import AdminUsersPanel from '../components/AdminUsersPanel';
import AdminCloudUploadsPanel from "../components/AdminCloudUploadsPanel";

const AdminLayout = () => {
  const [activePanel, setActivePanel] = useState("start");

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar onSelect={setActivePanel} />
      <main style={{ flexGrow: 1, padding: "16px" }}>

        {activePanel === "start" && <p>Start panel selected</p>}
        {activePanel === "excel" && <AdminExcelUploadPanel />}
        {activePanel === "bills" && <AdminBillsPanel />}
        {activePanel === "users" && <AdminUsersPanel />}
        {activePanel === "uploads" && <AdminCloudUploadsPanel />}
        
        <Outlet />

      </main>
    </div>
  );
};

export default AdminLayout;
