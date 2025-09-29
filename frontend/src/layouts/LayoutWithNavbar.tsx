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
      {/* εδω είναι το navbar  και απο κάτω το υπόλοιπο περιεχόμενο της σελιδας */}
      <Navbar />  
      <Box
        sx={{ flexGrow: 1 }} // style extensions → όλο τον οριζόντιο χώρο
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default LayoutWithNavbar;
