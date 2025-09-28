import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

const LayoutWithNavbar = () => {
  return (
    <Box sx={{ 
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutWithNavbar;
