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
  Button,
  Stack,
  Box,
} from "@mui/material";
import axios from "axios";
import { VariablesContext } from "../context/VariablesContext";
import type { GlobalBillType, BillType } from "../types/excel.types";
import React from "react";
import AdminBillsFooter from "./AdminBillsFooter";
import AdminBuildingMailer from "./AdminBuildingMailer";

const AdminBillsPanel = () => {
  const { url } = useContext(VariablesContext);

  const [globalBills, setGlobalBills] = useState<GlobalBillType[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [billsMap, setBillsMap] = useState<Record<string, BillType[]>>({});
  const [loading, setLoading] = useState(false);

  const [buildings, setBuildings] = useState<string[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [buildingEmails, setBuildingEmails] = useState<string[]>([])

  const fetchGlobalBills = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get<{ status: boolean; data: GlobalBillType[] }>(
        `${url}/api/global-bills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.data;
      setGlobalBills(data);

      // extract unique buildings
      const uniqueBuildings = [...new Set(data.map((g) => g.building))];
      setBuildings(uniqueBuildings);

      // auto-select first building
      if (uniqueBuildings.length > 0 && !selectedBuilding) {
        setSelectedBuilding(uniqueBuildings[0]);
      }
    } catch (err) {
      console.error("Error fetching global bills:", err);
    } finally {
      setLoading(false);
    }
  }, [url, selectedBuilding]);

  const fetchBillsForGlobal = async (globalId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get<{ status: boolean; data: BillType[] }>(
        `${url}/api/bills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const filtered = res.data.data.filter(
        (b) => b.globalBillId?.toString() === globalId.toString()
      );
      setBillsMap((prev) => ({ ...prev, [globalId]: filtered }));
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  // load global bills once
  useEffect(() => {
    fetchGlobalBills();
  }, [fetchGlobalBills]);

  // auto-fetch bills for all global bills when they load
  useEffect(() => {
    if (globalBills.length > 0) {
      globalBills.forEach((g) => {
        if (!billsMap[g.id]) {
          fetchBillsForGlobal(g.id);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalBills]);

  // create an array with all the building emails
  const fetchEmailsForBuilding = useCallback(async (buildingName: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get<{ status: boolean; data: any[] }>(
        `${url}/api/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const users = res.data.data
      const emails = users
        .filter(u => u.building === buildingName && !!u.email)
        .map(u => u.email)

      setBuildingEmails(emails)
    } catch (err) {
      console.error('Error fetching emails:', err)
      setBuildingEmails([])
    }
  }, [url])

  useEffect(() => {
    if (selectedBuilding) {
      fetchEmailsForBuilding(selectedBuilding)
    }
  }, [selectedBuilding, fetchEmailsForBuilding])


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
    if (bills.some((b) => b.status === "PENDING")) return "#e5f0ff"; // light blue
    if (bills.some((b) => b.status === "UNPAID")) return "#ffe5e5"; // light red
    if (bills.length > 0 && bills.every((b) => b.status === "PAID"))
      return "#e5ffe5"; // light green
    return "inherit";
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

      {/* Building buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
        {buildings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No bills in the system
          </Typography>
        ) : (
          buildings.map((b) => (
            <Button
              key={b}
              variant={b === selectedBuilding ? "contained" : "outlined"}
              onClick={() => {
                setSelectedBuilding(b);
                setExpanded(null); // reset expanded row
              }}
            >
              {b}
            </Button>
          ))
        )}
      </Stack>

      {/* 📨 Mass mailer section */}
      {selectedBuilding && (
        <AdminBuildingMailer
          building={selectedBuilding}
          emails={buildingEmails}
        />
      )}

      {/* Building bills table */}
      {selectedBuilding && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bills for {selectedBuilding}
          </Typography>

          <TableContainer component={Paper}>
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
                  .filter(
                    (g) =>
                      g.building === selectedBuilding &&
                      (showAll || g.status !== "COMPLETE")
                  )
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
        </Box>
      )}
    </div>
  );
};

export default AdminBillsPanel;
