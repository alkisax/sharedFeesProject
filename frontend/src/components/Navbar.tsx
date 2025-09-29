import { AppBar, Toolbar, IconButton, Box, Button, Typography, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";

const Navbar = () => {

  const { user, logout } = useContext(UserAuthContext);

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

          {/* Admin Panel or Roles */}
          {user && user.roles?.includes("ADMIN") ? (
            <Button
              id="navbar-admin-btn"
              color="inherit"
              component={Link}
              to="/admin-panel"
            >
              Admin Panel
            </Button>
          ) : (
            user && (
              <Typography variant="body2" sx={{ color: "inherit", mr: 2 }}>
                Roles: {user.roles?.join(", ")}
              </Typography>
            )
          )}

          {/* Right side: Login / Logout */}
          {user ? (
            <>
              <Tooltip title="Profile">
                <IconButton
                  id="navbar-profile-btn"
                  component={Link}
                  to="/profile"
                  sx={{ color: "inherit" }}
                >
                  <AccountCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Logout">
                <IconButton
                  id="navbar-logout"
                  sx={{ color: "inherit" }}
                  onClick={() => logout()}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Login">
              <IconButton
                id="navbar-login"
                component={Link}
                to="/login"
                sx={{ color: "inherit" }}
              >
                <LoginIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      </AppBar>
      {/* offset so content is not hidden under AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;
