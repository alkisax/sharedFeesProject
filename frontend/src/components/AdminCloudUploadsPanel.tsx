// src/components/AdminCloudUploadsPanel.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Typography, Button, List, ListItem, ListItemText, Box,
  Pagination, Dialog, DialogTitle, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppwriteUploader } from "../hooks/useAppwriteUploader";

interface CloudFile {
  $id: string;
  name: string;
  mimeType: string;
  sizeOriginal: number;
  $createdAt: string;
}

const AdminCloudUploadsPanel = () => {
  // from custom hook
  const { ready, uploadFile, listFiles, deleteFile, getFileUrl } = useAppwriteUploader();

  const [files, setFiles] = useState<CloudFile[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // popup state
  const [previewFile, setPreviewFile] = useState<CloudFile | null>(null);

  const loadPage = useCallback(async (pageNum: number) => {
    const res = await listFiles(pageNum, limit);
    setFiles(res.files);
    setTotal(res.total);
  }, [listFiles]);

  useEffect(() => {
    if (ready) loadPage(page);
  }, [ready, page, loadPage]);

  const handleUpload = async () => {
    if (!file) return;
    await uploadFile(file);
    setFile(null);
    loadPage(page);
  };

  const handleDelete = async (id: string) => {
    await deleteFile(id);
    loadPage(page);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Cloud Uploads (Appwrite)
      </Typography>

      {/* Upload control */}
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || !ready}
        sx={{ ml: 2 }}
      >
        Upload
      </Button>

      {/* File list */}
      <List>
        {files.map((f) => (
          <ListItem
            key={f.$id}
            secondaryAction={
              <Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setPreviewFile(f)}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(f.$id)}
                >
                  ❌
                </Button>
              </Box>
            }
          >
            <ListItemText
              primary={f.name}
              secondary={`${f.mimeType} — ${(f.sizeOriginal / 1024).toFixed(1)} KB — ${new Date(f.$createdAt).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Pagination
        count={Math.ceil(total / limit)}
        page={page}
        onChange={(_, value) => setPage(value)}
        sx={{ mt: 2 }}
      />

      {/* Preview dialog */}
      <Dialog
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {previewFile?.name}
          <IconButton
            aria-label="close"
            onClick={() => setPreviewFile(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewFile && previewFile.mimeType.startsWith("image/") && (
            <img
              src={getFileUrl(previewFile.$id)}
              alt={previewFile.name}
              style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }}
            />
          )}
          {previewFile && previewFile.mimeType === "application/pdf" && (
            <iframe
              src={getFileUrl(previewFile.$id)}
              title={previewFile.name}
              style={{ width: "100%", height: "80vh", border: "none" }}
            />
          )}
          {previewFile &&
            !previewFile.mimeType.startsWith("image/") &&
            previewFile.mimeType !== "application/pdf" && (
              <Typography>
                Cannot preview this file type.{" "}
                <a
                  href={getFileUrl(previewFile.$id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download instead
                </a>
              </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminCloudUploadsPanel;
