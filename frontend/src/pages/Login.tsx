// src/components/Login.tsx
import { Box, Paper, Typography, Divider } from "@mui/material";
import LoginBackend from "../components/loginComponents/LoginBackend";

const Login = () => {

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5">Login</Typography>
        <Divider />
        <LoginBackend />
      </Paper>
    </Box>
  );
};

export default Login;
