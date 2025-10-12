// src/components/AdminUsersPanel.tsx
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { VariablesContext } from "../context/VariablesContext";
import { UserAuthContext } from "../context/UserAuthContext";
import type { UserView } from "../types/auth.types";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent,
  Stack, Typography, IconButton, TextField, Box, Tooltip, useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

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

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
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
      const { confirmPassword, ...rest } = createForm;
      const payload = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== "")
      );

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

  if (isLoading) return <p>Loading...</p>;

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
                  .filter(
                    (u) =>
                      u.building === building &&
                      !(u.username === 'alkisax' && u.roles.includes('ADMIN'))
                  )
                  .map((user, idx) => (
                    <TableRow
                      key={user.id}
                      sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
                    >
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.lastname}</TableCell>
                      <TableCell>{user.flat}</TableCell>
                      <TableCell>
                        {user.balance != null ? user.balance.toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {isSmall ? (
                            <>
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleEdit(user)}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error" onClick={() => handleDelete(user)}>
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={user.roles.includes("ADMIN") ? "Remove Admin" : "Make Admin"}>
                                <IconButton
                                  size="small"
                                  color={user.roles.includes("ADMIN") ? "warning" : "success"}
                                  onClick={() => handleToggleAdmin(user)}
                                >
                                  <AdminPanelSettingsIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View More">
                                <IconButton size="small" onClick={() => setViewUser(user)}>
                                  <VisibilityIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(user)}
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
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Edit Modal */}
      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit User
          <IconButton
            aria-label="close"
            onClick={() => setSelectedUser(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Username"
                value={editForm.username || ""}
                onChange={e => setEditForm({ ...editForm, username: e.target.value })}
              />
              <TextField
                label="Firstname"
                value={editForm.firstname || ""}
                onChange={e => setEditForm({ ...editForm, firstname: e.target.value })}
              />
              <TextField
                label="Lastname"
                value={editForm.lastname || ""}
                onChange={e => setEditForm({ ...editForm, lastname: e.target.value })}
              />
              <TextField
                label="Email"
                value={editForm.email || ""}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              />
              <TextField
                label="AFM"
                value={editForm.AFM || ""}
                onChange={e => setEditForm({ ...editForm, AFM: e.target.value })}
              />
              <TextField
                label="Building"
                value={editForm.building || ""}
                onChange={e => setEditForm({ ...editForm, building: e.target.value })}
              />
              <TextField
                label="Flat"
                value={editForm.flat || ""}
                onChange={e => setEditForm({ ...editForm, flat: e.target.value })}
              />
              <TextField
                label="Balance (€)"
                type="number"
                value={editForm.balance ?? ""}
                onChange={e =>
                  setEditForm({ ...editForm, balance: Number(e.target.value) })
                }
              />
              <TextField
                label="New Password"
                type="password"
                value={editForm.password || ""}
                onChange={e => setEditForm({ ...editForm, password: e.target.value })}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                value={editForm.confirmPassword || ""}
                onChange={e => setEditForm({ ...editForm, confirmPassword: e.target.value })}
              />
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" onClick={() => setSelectedUser(null)}>Cancel</Button>
                <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
              </Stack>
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Username"
              value={createForm.username}
              onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
              helperText="Use English characters for the username"
            />
            <TextField
              label="Password"
              type="password"
              value={createForm.password}
              onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={createForm.confirmPassword}
              onChange={e => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
            />
            <TextField
              label="Firstname"
              value={createForm.firstname}
              onChange={e => setCreateForm({ ...createForm, firstname: e.target.value })}
            />
            <TextField
              label="Lastname"
              value={createForm.lastname}
              onChange={e => setCreateForm({ ...createForm, lastname: e.target.value })}
            />
            <TextField
              label="Email"
              value={createForm.email}
              onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
            />
            <TextField
              label="Building"
              value={createForm.building}
              onChange={e => setCreateForm({ ...createForm, building: e.target.value })}
              helperText="Must match Excel: English, no spaces (e.g. Katerinis14)"
            />
            <TextField
              label="Flat"
              value={createForm.flat}
              onChange={e => setCreateForm({ ...createForm, flat: e.target.value })}
              helperText="Must match Excel exactly: Greek capital letters (e.g. Α1, ΙΣ)"
            />
            <TextField
              label="AFM"
              value={createForm.AFM}
              onChange={e => setCreateForm({ ...createForm, AFM: e.target.value })}
            />
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleCreateUser}>Create</Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* View More Modal */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Stack spacing={1}>
              <Typography><b>ID:</b> {viewUser.id}</Typography>
              <Typography><b>Username:</b> {viewUser.username}</Typography>
              <Typography><b>Email:</b> {viewUser.email}</Typography>
              <Typography><b>Roles:</b> {viewUser.roles.join(", ")}</Typography>
              <Typography><b>Building:</b> {viewUser.building}</Typography>
              <Typography><b>Flat:</b> {viewUser.flat}</Typography>
              <Typography><b>Balance:</b> {viewUser.balance ?? 0}</Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsersPanel;
