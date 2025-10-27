// src/components/AdminBillsFooter.tsx
import { useState, useContext } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableHead,
  DialogActions,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TableChartIcon from "@mui/icons-material/TableChart"; // ✅ icon for popup button
import VisibilityIcon from "@mui/icons-material/Visibility";
import DoneIcon from "@mui/icons-material/Done";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptIcon from "@mui/icons-material/Receipt";
import axios from 'axios';
import type { BillType } from '../types/excel.types';
import { VariablesContext } from '../context/VariablesContext';

interface Props {
  bills: BillType[];
  colSpan: number;
  onRefresh?: () => void; // parent can trigger reload
}

const statusColor = (status: BillType['status']) => {
  switch (status) {
    case 'UNPAID':
      return 'warning';
    case 'PAID':
      return 'success';
    case 'PENDING':
      return 'info';
    case 'CANCELED':
      return 'default';
    default:
      return 'default';
  }
};

const AdminBillsFooter = ({ bills, colSpan, onRefresh }: Props) => {
  const { url } = useContext(VariablesContext);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const [viewUrl, setViewUrl] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [selectedBill, setSelectedBill] = useState<BillType | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // ✅ state for popup tables
  const [openTables, setOpenTables] = useState(false);

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // extend types
  const handleAction = async (
    billId: string,
    action: 'approve' | 'cancel' | 'cash' | "delete"
  ) => {
    try {
      let method: 'patch' | 'delete' = 'patch'
      let endpoint = '';
      if (action === 'approve') {
        endpoint = `${url}/api/bills/${billId}/approve`;
      } else if (action === 'cancel') {
        endpoint = `${url}/api/bills/${billId}/cancel`;
      } else if (action === 'cash') {
        endpoint = `${url}/api/bills/${billId}/pay-cash`;
      } 
      else if (action === 'delete') {
      // 🧠 Safe delete: cancel first to restore balance, then delete
      const cancelEndpoint = `${url}/api/bills/${billId}/cancel`;
      await axios.patch(cancelEndpoint, {}, { headers: { Authorization: `Bearer ${token}` } });

      endpoint = `${url}/api/bills/${billId}`;
      method = 'delete';
    }

      // await axios.patch(
      //   endpoint,
      //   {},
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      if (method === 'delete') {
        await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await axios.patch(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } })
      }

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(`Failed to ${action} bill`, err);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell colSpan={colSpan}>
          {bills.length === 0 && (
            <Typography variant='body2'>
              No bills found for this GlobalBill.
            </Typography>
          )}

          {bills.map((b) => (
            <Box
              key={b.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                mb: 0.5,
                borderRadius: 1,
                bgcolor: '#fafafa',
              }}
            >
              <Typography variant='body2'>
                {b.flat} – {b.ownerName} (Σύνολο: {b.amount}€)
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                {/* ❌ Cancel available only on PENDING or PAID */}
                {(b.status === "PENDING" || b.status === "PAID") && (
                  isSmall ? (
                    <Tooltip title="Cancel this bill">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setConfirmCancel(b.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => setConfirmCancel(b.id)}
                    >
                      Cancel
                    </Button>
                  )
                )}

                {/* 🗑️ Delete button (only for admin correction) */}
                {(b.status === "UNPAID" || b.status === "CANCELED") && (
                  isSmall ? (
                    <Tooltip title="Delete this bill">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setConfirmDelete(b.id)}
                      >
                        <WarningAmberIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => setConfirmDelete(b.id)}
                    >
                      Delete
                    </Button>
                  )
                )}

                {b.receiptUrl && (
                  isSmall ? (
                    <Tooltip title="View Receipt">
                      <IconButton
                        size="small"
                        onClick={() => setViewUrl(b.receiptUrl!)}
                      >
                        <ReceiptIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setViewUrl(b.receiptUrl!)}
                    >
                      View Receipt
                    </Button>
                  )
                )}

                {b.status === "PENDING" && (
                  isSmall ? (
                    <Tooltip title="Approve">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleAction(b.id, "approve")}
                      >
                        <DoneIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleAction(b.id, "approve")}
                    >
                      Approve
                    </Button>
                  )
                )}

                {b.status === "UNPAID" && (
                  isSmall ? (
                    <Tooltip title="Paid in Cash">
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleAction(b.id, "cash")}
                      >
                        <AttachMoneyIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAction(b.id, "cash")}
                    >
                      Paid in Cash
                    </Button>
                  )
                )}

                {isSmall ? (
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => setSelectedBill(b)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedBill(b)}
                  >
                    View
                  </Button>
                )}

                <Chip label={b.status} color={statusColor(b.status)} size="small" />
              </Stack>
            </Box>
          ))}

          {/* ✅ Button to show big tables in popup */}
          {bills.length > 0 && (
            <Box mt={2} textAlign="right">
              <Button
                variant="outlined"
                startIcon={<TableChartIcon />}
                onClick={() => setOpenTables(true)}
              >
                View Breakdown Tables
              </Button>
            </Box>
          )}
        </TableCell>
      </TableRow>

      {/* ✅ Popup dialog with full-width tables */}
      <Dialog
        open={openTables}
        onClose={() => setOpenTables(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Detailed Breakdown</DialogTitle>
        <DialogContent dividers>
          {bills.length === 0 ? (
            <Typography>No bills to show</Typography>
          ) : (
            <>
              {/* Aggregated breakdown */}
              <Box mb={3} sx={{ overflowX: "auto" }}>
                <Typography variant="h6" gutterBottom>
                  Breakdown
                </Typography>
                <Paper sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#FFF9C4" }}>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Amount (€)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(bills[0].breakdown).map(([category, value], idx) => (
                        <TableRow
                          key={category}
                          sx={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
                        >
                          <TableCell sx={{ fontWeight: "bold" }}>{category}</TableCell>
                          <TableCell align="right">{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>

              {/* User bills breakdown */}
              <Box sx={{ overflowX: "auto" }}>
                <Typography variant="h6" gutterBottom>
                  User Bills
                </Typography>
                <Paper sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#FFF9C4" }}>
                        <TableCell>ΔΙΑΜ</TableCell>
                        <TableCell>ΟΝΟΜΑ</TableCell>
                        <TableCell>Χιλιοστά</TableCell>
                        {Object.keys(bills[0].breakdown).map((cat) => (
                          <TableCell key={cat}>{cat}</TableCell>
                        ))}
                        <TableCell>ΣΥΝΟΛΟ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bills.map((b, idx) => (
                        <TableRow
                          key={b.id}
                          sx={{ backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}
                        >
                          <TableCell>{b.flat}</TableCell>
                          <TableCell>{b.ownerName}</TableCell>
                          <TableCell>{b.share ?? "-"}</TableCell>
                          {Object.keys(b.breakdown).map((cat) => (
                            <TableCell key={cat}>{b.breakdown[cat] ?? 0}</TableCell>
                          ))}
                          <TableCell sx={{ fontWeight: "bold" }}>{b.amount}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#E6E6FA" }}>
                        <TableCell>-</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>ΣΥΝΟΛΑ</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {bills.reduce((acc, b) => acc + (b.share ?? 0), 0)}
                        </TableCell>
                        {Object.keys(bills[0].breakdown).map((cat) => (
                          <TableCell key={cat} sx={{ fontWeight: "bold" }}>
                            {bills.reduce((acc, b) => acc + (b.breakdown[cat] ?? 0), 0)}
                          </TableCell>
                        ))}
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {bills.reduce((acc, b) => acc + b.amount, 0)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Preview */}
      <Dialog open={!!viewUrl} onClose={() => setViewUrl(null)} maxWidth='md' fullWidth>
        <DialogTitle>Receipt Preview</DialogTitle>
        <DialogContent>
          {viewUrl ? (
            <iframe
              src={viewUrl}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title="receipt"
            />
          ) : (
            <Typography>No receipt available</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <Typography color="error" fontWeight="bold">
            This will permanently delete the bill from the database.
          </Typography>
          <Typography mt={1}>
            Are you sure you want to proceed? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              if (confirmDelete) handleAction(confirmDelete, "delete")
              setConfirmDelete(null)
            }}
          >
            Yes, Delete
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => setConfirmDelete(null)}
          >
            Keep
          </Button>
        </DialogActions>
      </Dialog>


      {/* Confirm Cancel Dialog */}
      <Dialog
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon color="error" />
          Confirm Cancel
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this bill?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="outlined"
            onClick={() => {
              if (confirmCancel) handleAction(confirmCancel, "cancel");
              setConfirmCancel(null);
            }}
          >
            Yes, Cancel
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={() => setConfirmCancel(null)}
          >
            Do not cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* bill details popup */}
      <Dialog
        open={!!selectedBill}
        onClose={() => setSelectedBill(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Bill Details</DialogTitle>
        <DialogContent dividers>
          {selectedBill && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                {selectedBill.flat} – {selectedBill.ownerName}
              </Typography>
              <Typography>Status: {selectedBill.status}</Typography>
              {selectedBill.paymentMethod && (
                <Typography>Payment Method: {selectedBill.paymentMethod}</Typography>
              )}
              {selectedBill.paidAt && (
                <Typography>Paid At: {new Date(selectedBill.paidAt).toLocaleString()}</Typography>
              )}
              <Typography>Total Amount: {selectedBill.amount} €</Typography>

              <Box mt={2}>
                <Typography variant="subtitle2">Breakdown:</Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount (€)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(selectedBill.breakdown).map(([cat, val]) => (
                      <TableRow key={cat}>
                        <TableCell>{cat}</TableCell>
                        <TableCell align="right">{val}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {selectedBill.notes && selectedBill.notes.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="subtitle2" gutterBottom>Notes:</Typography>
                      <ul style={{ paddingLeft: "1.2rem", marginTop: 0 }}>
                        {selectedBill.notes.map((note, idx) => (
                          <li key={idx}>
                            <Typography variant="body2">{note}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                </Table>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedBill(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminBillsFooter;
