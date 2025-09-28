// src/components/AdminBillsFooter.tsx
import { TableRow, TableCell, Typography, Box, Chip } from "@mui/material";
import type { BillType } from "../types/excel.types";

interface Props {
  bills: BillType[];
  colSpan: number;
}

const statusColor = (status: BillType["status"]) => {
  switch (status) {
    case "UNPAID":
      return "warning"; // orange
    case "PAID":
      return "success"; // green
    case "PENDING":
      return "info"; // blue
    case "CANCELED":
      return "default"; // grey
    default:
      return "default";
  }
};

const AdminBillsFooter = ({ bills, colSpan }: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan}>
        {bills.length === 0 && (
          <Typography variant="body2">No bills found for this GlobalBill.</Typography>
        )}

        {bills.map((b) => (
          <Box
            key={b._id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              mb: 0.5,
              borderRadius: 1,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="body2">
              {b.flat} – {b.ownerName} (Σύνολο: {b.amount}€)
            </Typography>
            <Chip label={b.status} color={statusColor(b.status)} size="small" />
          </Box>
        ))}
      </TableCell>
    </TableRow>
  );
};

export default AdminBillsFooter;
