// src/components/AdminBillsPanel.tsx
import { useState, useEffect, useContext, useCallback } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { VariablesContext } from "../context/VariablesContext";

interface GlobalBillType {
  _id: string;
  month: string;
  building: string;
  status: string; // π.χ. OPEN | COMPLETE
  createdAt: string;
}

interface BillType {
  _id: string;
  flat: string;
  ownerName: string;
  breakdown: { amount: number; status: string };
  globalBillId: string;
}

const AdminBillsPanel = () => {
  const { url } = useContext(VariablesContext);

  const [globalBills, setGlobalBills] = useState<GlobalBillType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [bills, setBills] = useState<BillType[]>([]);
  const [selected, setSelected] = useState<GlobalBillType | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGlobalBills = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get<{ status: boolean; data: GlobalBillType[] }>(
        `${url}/api/global-bills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGlobalBills(res.data.data);
    } catch (err) {
      console.error("Error fetching global bills:", err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const fetchBillsForGlobal = async (globalId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get<{ status: boolean; data: BillType[] }>(
        `${url}/api/bills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // φιλτράρισμα με globalBillId
      const filtered = res.data.data.filter(
        (b) => b.globalBillId === globalId
      );
      setBills(filtered);
    } catch (err) {
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalBills();
  }, [fetchGlobalBills]);

  const handleOpen = (gb: GlobalBillType) => {
    setSelected(gb);
    fetchBillsForGlobal(gb._id);
    setOpen(true);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Global Bills
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={showAll}
            onChange={() => setShowAll((prev) => !prev)}
            color="primary"
          />
        }
        label={showAll ? "Showing all bills" : "Showing only open"}
      />

      {loading && <p>Loading...</p>}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell>Building</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {globalBills
              .filter((g) => showAll || g.status !== "COMPLETE")
              .map((g) => (
                <TableRow
                  key={g._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpen(g)}
                >
                  <TableCell>{g.month}</TableCell>
                  <TableCell>{g.building}</TableCell>
                  <TableCell>{g.status}</TableCell>
                  <TableCell>
                    {new Date(g.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Bills for {selected?.month}</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {bills.map((b) => (
              <ListItem key={b._id}>
                <ListItemText
                  primary={`${b.flat} - ${b.ownerName}`}
                  secondary={`Amount: ${b.breakdown.amount} | Status: ${b.breakdown.status}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminBillsPanel;
