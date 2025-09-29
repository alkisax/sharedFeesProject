// src/pages/Profile.tsx
import { useContext } from "react";
import { Box, Paper, Typography, TextField, Stack, Divider } from "@mui/material";
import { UserAuthContext } from "../context/UserAuthContext";

const Profile = () => {
  const { user, isLoading } = useContext(UserAuthContext);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography>You must be logged in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          My Profile
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Stack spacing={2}>
          {/* <TextField
            label="User ID"
            value={user.id}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          /> */}
          <TextField
            label="Username"
            value={user.username}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="First Name"
            value={user.firstname || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Last Name"
            value={user.lastname || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Email"
            value={user.email || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Phone"
            value={user.phone?.length ? user.phone.join(", ") : "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="AFM"
            value={user.AFM || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Building"
            value={user.building || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Flat"
            value={user.flat || "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Balance"
            value={user.balance ?? 0}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Last Cleared Month"
            value={user.lastClearedMonth ? new Date(user.lastClearedMonth).toLocaleDateString() : "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          {/* <TextField
            label="Notes"
            value={user.notes?.length ? user.notes.join(", ") : "—"}
            fullWidth
            multiline
            slotProps={{ input: { readOnly: true } }}
          /> */}
          {/* <TextField
            label="Uploads Mongo"
            value={user.uploadsMongo?.length ? user.uploadsMongo.join(", ") : "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          /> */}
          {/* <TextField
            label="Uploads Appwrite"
            value={user.uploadsAppwrite?.length ? user.uploadsAppwrite.join(", ") : "—"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          /> */}
          {/* <TextField
            label="Roles"
            value={user.roles.join(", ")}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          /> */}
          <TextField
            label="Has Password"
            value={user.hasPassword ? "Yes" : "No"}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Created At"
            value={new Date(user.createdAt).toLocaleString()}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
          <TextField
            label="Updated At"
            value={new Date(user.updatedAt).toLocaleString()}
            fullWidth
            slotProps={{ input: { readOnly: true } }}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default Profile;
