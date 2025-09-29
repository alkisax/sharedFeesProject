// src/routes/PrivateRoute.tsx
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = () => {
  const { user, isLoading } = useContext(UserAuthContext);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Only allow when user exists AND has role USER
  const hasUserRole = user?.roles?.includes("USER");

  return hasUserRole ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
