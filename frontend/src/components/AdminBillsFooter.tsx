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
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TableChartIcon from "@mui/icons-material/TableChart"; // ✅ icon for popup button
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

  // ✅ state for popup tables
  const [openTables, setOpenTables] = useState(false);

  const handleAction = async (billId: string, action: 'approve' | 'cancel') => {
    try {
      const endpoint =
        action === 'approve'
          ? `${url}/api/bills/${billId}/approve`
          : `${url}/api/bills/${billId}/cancel`;

      await axios.patch(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
                  <Tooltip title="Cancel this bill">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setConfirmCancel(b.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                )}

                {b.receiptUrl && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setViewUrl(b.receiptUrl!)}
                  >
                    View Receipt
                  </Button>
                )}

                {b.status === "PENDING" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(b.id, "approve")}
                  >
                    Approve
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
    </>
  );
};

export default AdminBillsFooter;
