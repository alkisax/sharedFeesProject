import { AppBar, Toolbar, IconButton, Box, Typography, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
            <Tooltip title="Admin Panel" arrow>
              <IconButton
                id="navbar-admin-btn"
                color="inherit"
                component={Link}
                to="/admin"
                sx={{ mr: 2 }}
              >
                <AdminPanelSettingsIcon />
              </IconButton>
            </Tooltip>
          ) : (
            user && (
              <Typography variant="body2" sx={{ color: "inherit", mr: 2 }}>
                {user.roles?.join(", ")}
              </Typography>
            )
          )}

          {user && !user.roles?.includes("ADMIN") && (
            <Tooltip title="My Bills" arrow>
              <IconButton
                id="navbar-user-btn"
                color="inherit"
                component={Link}
                to="/user"
                sx={{ mr: 2 }}
              >
                <ReceiptLongIcon />
              </IconButton>
            </Tooltip>
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
