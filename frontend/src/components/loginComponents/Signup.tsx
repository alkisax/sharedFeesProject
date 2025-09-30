import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import { frontendValidatePassword, frontEndValidateEmail } from "../../utils/validation";
import { VariablesContext } from "../../context/VariablesContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [afm, setAfm] = useState("");
  const [building, setBuilding] = useState("");
  const [flat, setFlat] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { url } = useContext(VariablesContext);

  const navigate = useNavigate();

  const handleRegisterBackend = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // check only required fields
    if (!username || !password || !confirmPassword) {
      setErrorMessage("Username and password are required");
      setLoading(false);
      return;
    }

    const passError = frontendValidatePassword(password);
    if (passError) {
      setErrorMessage(passError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    // email validation only if email provided
    if (email) {
      const emailError = frontEndValidateEmail(email);
      if (emailError) {
        setErrorMessage(emailError);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axios.post(`${url}/api/users/signup/user`, {
        username,
        password,
        firstname: firstname || undefined,
        lastname: lastname || undefined,
        email: email || undefined,
        phone: phone && phone.trim() !== "" ? [phone] : undefined,
        AFM: afm ? afm : undefined,
        building: building || undefined,
        flat: flat || undefined,
      });

      if (res.data.status) {
        alert("Account created successfully 🚀");
        navigate("/login");
      } else {
        setErrorMessage(res.data.error || res.data.data || "Registration failed");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const backendMsg = err.response?.data?.error || err.response?.data?.message;
        setErrorMessage(
          Array.isArray(backendMsg) ? backendMsg.join(", ") : backendMsg || "Unknown error"
        );
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
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
            />

            {/* Optional fields */}
            <TextField label="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} fullWidth />
            <TextField label="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
            <TextField label="AFM" value={afm} onChange={(e) => setAfm(e.target.value)} fullWidth />
            <TextField label="Building" value={building} onChange={(e) => setBuilding(e.target.value)} fullWidth />
            <TextField label="Flat" value={flat} onChange={(e) => setFlat(e.target.value)} fullWidth />

            {errorMessage && (
              <Typography variant="body2" color="error" align="center">
                {errorMessage}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
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
