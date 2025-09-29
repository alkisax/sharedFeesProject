// alkisax2 Pasword!

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Box, Button, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import type { BackendJwtPayload } from '../../types/auth.types'
import { UserAuthContext } from "../../context/UserAuthContext";

interface Props {
  url: string;
}

const LoginBackend = ({ url }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser, setIsLoading } = useContext(UserAuthContext);

  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmitBackend = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${url}/api/auth`, {
        username,
        password,
      });

      console.log("Login successful:", response.data);

      // store token
      const token = response.data.data.token;
      localStorage.setItem("token", token);

      // decode token → just to get user id
      const decoded = jwtDecode<BackendJwtPayload>(token);

      // fetch full user
      const res = await axios.get(`${url}/api/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = res.data.data;

      setUser({
        id: userData.id,
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone,
        AFM: userData.AFM,
        building: userData.building,
        flat: userData.flat,
        balance: userData.balance,
        lastClearedMonth: userData.lastClearedMonth,
        notes: userData.notes,
        uploadsMongo: userData.uploadsMongo,
        uploadsAppwrite: userData.uploadsAppwrite,
        roles: userData.roles,
        hasPassword: userData.hasPassword,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      });

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitBackend}
      sx={{
        maxWidth: 400,
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 5,
      }}
    >
      <TextField
        id="backend-login-username"
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        autoComplete="email"
      />

      <TextField
        id="backend-login-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        autoComplete="current-password"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        id="backend-form-submit-btn"
        type="submit" variant="contained" color="primary">
        Login
      </Button>

      <Typography variant="body2" align="center">
        Don’t have an account? <Link id="backend-form-register-link" to="/signup">Register</Link>
      </Typography>
      <Typography variant="caption" align="center">
        Powered by MongoDB
      </Typography>
    </Box>
  );
};

export default LoginBackend;
