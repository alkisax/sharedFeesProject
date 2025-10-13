// src/components/AdminSidebar.tsx
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, IconButton, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CampaignIcon from '@mui/icons-material/Campaign';

interface Props {
  onSelect: (panel: string) => void;
}

const AdminSidebar = ({ onSelect }: Props) => {
  const [active, setActive] = useState("start");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // ✅ collapse to hamburger on md and below
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (panel: string) => {
    setActive(panel);
    onSelect(panel);
    if (isMobile) setMobileOpen(false); // auto-close drawer on mobile
  };

  const drawerContent = (
    <>
      <Toolbar />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={active === "start"}
            onClick={() => handleSelect("start")}
          >
            <ListItemIcon>
              <PlayArrowIcon />
            </ListItemIcon>
            <ListItemText primary="Start" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={active === "excel"}
            onClick={() => handleSelect("excel")}
          >
            <ListItemIcon>
              <FileUploadIcon /> 
            </ListItemIcon>
            <ListItemText primary="Excel Upload" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={active === "bills"}
            onClick={() => handleSelect("bills")}
          >
            <ListItemIcon>
              <ApartmentIcon /> 
            </ListItemIcon>
            <ListItemText primary="Bills" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={active === "users"}
            onClick={() => handleSelect("users")}
          >
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={active === "uploads"}
            onClick={() => handleSelect("uploads")}
          >
            <ListItemIcon><CloudUploadIcon /></ListItemIcon>
            <ListItemText primary="Cloud Uploads" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={active === 'announcement'}
            onClick={() => handleSelect('announcement')}
          >
            <ListItemIcon>
              <CampaignIcon />
            </ListItemIcon>
            <ListItemText primary='Announcement' />
          </ListItemButton>
        </ListItem>        

      </List>
    </>
  );

  return (
    <>
      {/* ✅ Hamburger toggle visible only on md and below */}
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: "fixed",
            top: 72, // below AppBar
            left: 8,
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "white",
            border: "1px solid #ddd",
            "&:hover": { backgroundColor: "#f0f0f0" },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        variant={isMobile ? "temporary" : "permanent"} // ✅ mobile collapses, desktop always open
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: 220,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 220,
            boxSizing: "border-box",
            mt: isMobile ? 0 : "64px", // below navbar only on desktop
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AdminSidebar;
