import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material";
import { useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';

interface Props {
  onSelect: (panel: string) => void;
}

const AdminSidebar = ({ onSelect }: Props) => {
  const [active, setActive] = useState("start");

  const handleSelect = (panel: string) => {
    setActive(panel);
    onSelect(panel);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          mt: "64px", // below navbar
        },
      }}
    >
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

      </List>
    </Drawer>
  );
};

export default AdminSidebar;
