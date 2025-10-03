import { useState, useContext } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { VariablesContext } from '../context/VariablesContext';
import type { ExcelResponse, ExcelRow } from "../types/excel.types";
import { account, storage } from '../lib/appwriteConfig';
import { ID } from 'appwrite';

const AdminExcelUploadPanel = () => {
  const { url } = useContext(VariablesContext);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExcelResponse | null>(null);

  const handleUploadAppwrite = async (): Promise<void> => {
    if (!file) return;
    setLoading(true);

    try {
      // ensure session
      try {
        await account.get();
      } catch {
        await account.createAnonymousSession();
      }

      // ensure sender has token
      const token = localStorage.getItem('token');
      const authCheck  = await axios.get<{ status: Boolean, message: string}>(
        `${url}/api/auth/is-logedin`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (!authCheck.data.status) {
        console.log('user is not loged in')
        return;
      } else {
        console.log('is-logedin passed')
      }

      // upload to Appwrite
      const uploaded = await storage.createFile({
        bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
        fileId: ID.unique(),
        file,
      });

      const res = await axios.post<ExcelResponse>(`${url}/api/excel/process`, {
        fileId: uploaded.$id,
        originalName: file.name,
      });

      setResult(res.data);
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Upload failed';
      setResult({ status: false, message });
    } finally {
      setLoading(false);
    }
  };

  // this is the old Multer way of uploading the excel file. is kept here for future use
  // const handleUploadMulter = async () => {
  //   if (!file) return;
  //   setLoading(true);

  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);

  //     const res = await axios.post<ExcelResponse>(
  //       `${url}/api/excel/upload`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     setResult(res.data);
  //   } catch (err: unknown) {
  //     setResult({
  //       status: false,
  //       message:
  //         axios.isAxiosError(err) && err.response?.data?.message
  //           ? err.response.data.message
  //           : "Upload failed",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderGlobalInfoTable = (rows: ExcelRow[]) => {
    if (rows.length === 0) return null;

    const header = rows[0][0] as string;
    const dataRows = rows.slice(1).map((row) =>
      row.filter((_, idx) => idx !== 1)
    );

    return (
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          {header}
        </Typography>
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableBody>
              {dataRows.map((row, rIdx) => {
                const isTotalRow = row.some(
                  (cell) =>
                    typeof cell === "string" &&
                    cell.toLowerCase().includes("συνολο")
                );

                return (
                  <TableRow
                    key={rIdx}
                    sx={{
                      backgroundColor: isTotalRow
                        ? "#E6E6FA" // pastel lavender for totals
                        : rIdx % 2 === 0
                        ? "#FFFFFF" // zebra white
                        : "#FAFAFA", // zebra light grey
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <TableCell
                        key={cIdx}
                        sx={{ fontSize: "0.85rem", py: 0.5 }}
                      >
                        {cell ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    );
  };

  const renderUserBillsTable = (rows: ExcelRow[]) => {
    if (rows.length === 0) return null;

    // first row = headers
    const headers = rows[0] as string[];
    // rest = data
    const dataRows = rows.slice(1);

    return (
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          User Bills
        </Typography>
        <Paper sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFF9C4" /* retro yellow */ }}>
                {headers.map((h, idx) => (
                  <TableCell
                    key={idx}
                    sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataRows.map((row, rIdx) => {
                // ✅ Detect "ΣΥΝΟΛΟ" or "ΣΥΝΟΛΑ" in any column
                const isTotalRow = row.some(
                  (cell) =>
                    typeof cell === "string" &&
                    cell.trim().toLowerCase().startsWith("συνο")
                );

                return (
                  <TableRow
                    key={rIdx}
                    sx={{
                      backgroundColor: isTotalRow
                        ? "#E6E6FA" // pastel lavender highlight
                        : rIdx % 2 === 0
                        ? "#FFFFFF" // zebra white
                        : "#FAFAFA", // zebra grey
                    }}
                  >
                    {row.map((cell, cIdx) => (
                      <TableCell
                        key={cIdx}
                        sx={{
                          fontSize: "0.85rem",
                          py: 0.5,
                          fontWeight: isTotalRow ? "bold" : "normal", // bold totals
                        }}
                      >
                        {cell ?? "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Excel Upload
      </Typography>

      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <Button
        variant="contained"
        sx={{ ml: 2 }}
        disabled={!file || loading}
        onClick={handleUploadAppwrite}
      >
        {loading ? <CircularProgress size={20} /> : "Upload"}
      </Button>

      {result && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            {result.message}
          </Typography>

          {result.data?.globalInfo &&
            renderGlobalInfoTable(result.data.globalInfo)}

          {result.data?.userBills &&
            renderUserBillsTable(result.data.userBills)}


          {!result.data && (
            <pre
              style={{
                background: "#f5f5f5",
                padding: "1rem",
                borderRadius: 4,
              }}
            >
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AdminExcelUploadPanel;
