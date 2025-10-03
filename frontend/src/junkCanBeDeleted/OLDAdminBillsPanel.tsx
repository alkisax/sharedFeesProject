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
} from "@mui/material";
import axios from "axios";
import { VariablesContext } from "../context/VariablesContext";
import type { GlobalBillType, BillType } from "../types/excel.types";
import React from "react";
import AdminBillsFooter from "./AdminBillsFooter";

const AdminBillsPanel = () => {
  const { url } = useContext(VariablesContext);

  const [globalBills, setGlobalBills] = useState<GlobalBillType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [billsMap, setBillsMap] = useState<Record<string, BillType[]>>({});
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

      console.log("Fetched bills:", res.data.data);
      console.log("Looking for globalId:", globalId);

      const filtered = res.data.data.filter((b) => {
        console.log("Bill globalBillId:", b.globalBillId, "===", globalId);
        return b.globalBillId?.toString() === globalId.toString();
      });
      setBillsMap((prev) => ({ ...prev, [globalId]: filtered }));
    } catch (err) {
      console.error("Error fetching bills:", err);
    } finally {
      setLoading(false);
    }
  };

  // 1. load global bills once
  useEffect(() => {
    fetchGlobalBills();
  }, [fetchGlobalBills]);

  // 2. when globalBills state is updated, fetch bills for each
  useEffect(() => {
    if (globalBills.length > 0) {
      globalBills.forEach((g) => {
        fetchBillsForGlobal(g.id);
      });
    }
  }, [globalBills]);

  const handleToggleExpand = (gb: GlobalBillType) => {
    if (expanded === gb.id) {
      setExpanded(null);
    } else {
      setExpanded(gb.id);
      if (!billsMap[gb.id]) {
        fetchBillsForGlobal(gb.id);
      }
    }
  };

  const getRowColor = (bills: BillType[]): string => {
    if (bills.some((b) => b.status === 'PENDING')) return '#e5f0ff'; // light blue
    if (bills.some((b) => b.status === 'UNPAID')) return '#ffe5e5'; // light red
    if (bills.length > 0 && bills.every((b) => b.status === 'PAID')) return '#e5ffe5'; // light green
    return 'inherit';
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
                <React.Fragment key={g.id}>
                  <TableRow
                    hover
                    sx={{
                      cursor: "pointer",
                      bgcolor: getRowColor(billsMap[g.id] || []),
                     }}
                    onClick={() => handleToggleExpand(g)}
                  >
                    <TableCell>{g.month}</TableCell>
                    <TableCell>{g.building}</TableCell>
                    <TableCell>{g.status}</TableCell>
                    <TableCell>
                      {new Date(g.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>

                  {expanded === g.id && (
                    <AdminBillsFooter
                      bills={billsMap[g.id] || []}
                      colSpan={4}
                      onRefresh={() => fetchBillsForGlobal(g.id)}
                    />
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminBillsPanel;
