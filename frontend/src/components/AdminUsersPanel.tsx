// src/components/AdminUsersPanel.tsx
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { VariablesContext } from "../context/VariablesContext";
import { UserAuthContext } from "../context/UserAuthContext";
import type { UserView } from "../types/auth.types";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  Stack, Typography, IconButton, TextField, Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface UserEditView extends UserView {
  password?: string;
  confirmPassword?: string;
}

const AdminUsersPanel = () => {
  const { isLoading } = useContext(UserAuthContext);
  const { url } = useContext(VariablesContext);

  const [users, setUsers] = useState<UserView[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserView | null>(null);
  const [viewUser, setViewUser] = useState<UserView | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserEditView>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    email: "",
    building: "",
    flat: "",
    AFM: "",
  });

  // fetch all users
  const fetchAllUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ status: boolean; data: UserView[] }>(
        `${url}/api/users/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.data);
    } catch {
      console.log("error fetching all users");
    }
  }, [url]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // delete user
  const handleDelete = async (user: UserView) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const userId = user.id;
    if (!userId) return alert("User ID not found");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${url}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAllUsers();
      alert("User deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  // toggle admin role
  const handleToggleAdmin = async (user: UserView) => {
    const userId = user.id;
    if (!userId) return alert("User ID not found");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${url}/api/users/toggle-admin/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        const updated = res.data.data as UserView;
        setUsers(prev =>
          prev.map(u => (u.id === updated.id ? updated : u))
        );
        alert(
          updated.roles.includes("ADMIN")
            ? "Admin privileges granted"
            : "Admin privileges removed"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update roles");
    }
  };

  // open edit dialog
  const handleEdit = (user: UserView) => {
    setSelectedUser(user);
    setEditForm(user);
  };

  // save edits
  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    // ✅ check confirm password if provided
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // ✅ remove confirmPassword before sending, strip empty strings
      const { confirmPassword, ...rest } = editForm;
      const payload = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== "")
      );

      const res = await axios.put(
        `${url}/api/users/${selectedUser.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        const updated = res.data.data as UserView;
        setUsers(prev =>
          prev.map(u => (u.id === updated.id ? updated : u))
        );
        setSelectedUser(null);
        alert("User updated");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // create new user
  const handleCreateUser = async () => {
    if (createForm.password !== createForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const { confirmPassword, ...rest } = createForm; // ✅ exclude confirmPassword

      // ✅ remove fields with empty strings
      const payload = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== "")
      );

      console.log("Payload:", payload);
      const res = await axios.post(`${url}/api/users/signup/user`, payload);

      if (res.data.status) {
        await fetchAllUsers();
        setCreateOpen(false);
        setCreateForm({
          username: "",
          password: "",
          confirmPassword: "",
          firstname: "",
          lastname: "",
          email: "",
          building: "",
          flat: "",
          AFM: "",
        });
        alert("User created successfully 🚀");
      } else {
        alert("User creation failed");
      }
    } catch (err) {
      console.error("Create failed:", err);
      alert("Create failed");
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // group users by building
  const buildings = [...new Set(users.map((u) => u.building))];

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
          Create User
        </Button>
      </Stack>

      {buildings.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No users found.
        </Typography>
      )}

      {buildings.map((building) => (
        <Box key={building} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Building: {building || "—"}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Lastname</TableCell>
                  <TableCell>Flat</TableCell>
                  <TableCell>Balance (€)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users
                  .filter((u) => u.building === building)
                  .map((user, idx) => (
                    <TableRow
                      key={user.id}
                      sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
                    >
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.flat}</TableCell>
                      <TableCell>{user.balance ?? 0}</TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(user)}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            color={user.roles.includes("ADMIN") ? "warning" : "success"}
                            size="small"
                            onClick={() => handleToggleAdmin(user)}
                          >
                            {user.roles.includes("ADMIN") ? "Remove Admin" : "Make Admin"}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setViewUser(user)}
                          >
                            View More
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </>
  );
};

export default AdminUsersPanel;