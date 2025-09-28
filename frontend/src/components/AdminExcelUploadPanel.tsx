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
import { VariablesContext } from "../../context/VariablesContext";
import type { ExcelResponse, ExcelRow } from "../../types/excel.types";

const AdminExcelUploadPanel = () => {
  const { url } = useContext(VariablesContext);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExcelResponse | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post<ExcelResponse>(
        `${url}/api/excel/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setResult(res.data);
    } catch (err: unknown) {
      setResult({
        status: false,
        message:
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Upload failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (title: string, rows: ExcelRow[]) => (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {rows[0]?.map((_, idx) => (
                <TableCell key={idx}>Col {idx + 1}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rIdx) => (
              <TableRow key={rIdx}>
                {row.map((cell, cIdx) => (
                  <TableCell key={cIdx}>{cell ?? "-"}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );

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
        onClick={handleUpload}
      >
        {loading ? <CircularProgress size={20} /> : "Upload"}
      </Button>

      {result && (
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            {result.message}
          </Typography>

          {result.data?.globalInfo &&
            renderTable("Global Info", result.data.globalInfo)}

          {result.data?.userBills &&
            renderTable("User Bills", result.data.userBills)}

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
