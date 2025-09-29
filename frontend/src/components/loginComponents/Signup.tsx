import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import { frontendValidatePassword, frontEndValidateEmail } from "../../utils/validation";
import { VariablesContext } from "../../context/VariablesContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { url } = useContext(VariablesContext);

  const navigate = useNavigate();

  const handleRegisterBackend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // basic validation
    const passError = frontendValidatePassword(password);
    if (passError) {
      setErrorMessage(passError);
      setLoading(false);
      return;
    }
    const emailError = frontEndValidateEmail(email);
    if (emailError) {
      setErrorMessage(emailError);
      setLoading(false);
      return;
    }
    if (!username || !firstname || !lastname || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${url}/api/users/signup/user`, {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      if (res.data.status) {
        alert("Account created successfully 🚀");
        navigate("/login"); // or auto-login if you extend backend to return a token
      } else {
        setErrorMessage(res.data.error || res.data.data || "Registration failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendMsg = err.response?.data?.error || err.response?.data?.message;
        if (backendMsg) {
          setErrorMessage(Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg);
        } else {
          setErrorMessage("An unknown error occurred during registration");
        }
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred during registration");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register
        </Typography>

        <Box component="form" onSubmit={handleRegisterBackend} noValidate>
          <Stack spacing={2}>
            <TextField
              id="backend-form-username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="backend-form-firstname"
              label="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="backend-form-lastname"
              label="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="backend-form-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="backend-form-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              id="backend-form-confirm-password"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />

            {errorMessage && (
              <Typography variant="body2" color="error" align="center">
                {errorMessage}
              </Typography>
            )}

            <Button
              id="backend-form-submit-btn"
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? "Loading..." : "Register"}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;
