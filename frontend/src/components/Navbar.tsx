import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <AppBar position="fixed" color="default">
        <Toolbar>
          {/* Left side: Home */}
          <IconButton
            component={Link}
            to="/"
            edge="start"
            sx={{ color: "inherit" }}
          >
            <HomeIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          {/* Right side: Login / Logout */}
          <IconButton sx={{ color: "inherit" }}>
            <LoginIcon />
          </IconButton>
          <IconButton sx={{ color: "inherit" }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;
