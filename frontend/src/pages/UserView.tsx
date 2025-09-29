// src/pages/UserView.tsx
import { useEffect, useState, useCallback, useContext } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  LinearProgress,
} from '@mui/material';
import axios from 'axios';
import { VariablesContext } from '../context/VariablesContext';
import { UserAuthContext } from '../context/UserAuthContext';
import type { BillType } from '../types/excel.types';

type UploadState = Record<string, File | null>;
type BusyState = Record<string, boolean>;
type ErrorState = Record<string, string | null>;

const STATUS_COLOR: Record<BillType['status'], 'warning' | 'success' | 'info' | 'default'> = {
  UNPAID: 'warning',
  PAID: 'success',
  PENDING: 'info',
  CANCELED: 'default',
};

const MAX_MB = 3;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED_MIME = new Set<string>([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const Userview = () => {
  const { url } = useContext(VariablesContext);
  const { isLoading } = useContext(UserAuthContext);

  const [bills, setBills] = useState<BillType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploads, setUploads] = useState<UploadState>({});
  const [busy, setBusy] = useState<BusyState>({});
  const [errors, setErrors] = useState<ErrorState>({});

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchMyBills = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<{ status: boolean; data: BillType[] }>(`${url}/api/bills/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(res.data.data);
    } catch (err: unknown) {
      console.error('Failed to fetch my bills:', err);
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  useEffect(() => {
    if (!isLoading) {
      fetchMyBills();
    }
  }, [isLoading, fetchMyBills]);

  const onFileChange = (billId: string, file: File | null) => {
    setErrors({ ...errors, [billId]: null });
    setUploads({ ...uploads, [billId]: file });
  };

  const validateFile = (file: File | null): string | null => {
    if (!file) return 'Δεν επιλέχθηκε αρχείο';
    if (file.size > MAX_BYTES) return `Μέγιστο μέγεθος ${MAX_MB}MB`;
    if (!ALLOWED_MIME.has(file.type)) return 'Επιτρέπονται PDF ή εικόνες';
    return null;
  };

  const submitProof = async (bill: BillType) => {
    try {
      setBusy({ ...busy, [bill.id]: true });
      setErrors({ ...errors, [bill.id]: null });

      const file = uploads[bill.id] ?? null;
      const fileError = validateFile(file);
      if (fileError) {
        setErrors({ ...errors, [bill.id]: fileError });
        setBusy({ ...busy, [bill.id]: false });
        return;
      }

      // 1) upload file via existing multer endpoint
      const form = new FormData();
      form.append('file', file as File);
      // optional: include a simple name/desc
      form.append('name', `receipt_${bill.month}_${bill.flat}`);
      form.append('desc', `Απόδειξη για λογαριασμό ${bill.month} - ${bill.flat}`);

      const uploadRes = await axios.post(
        `${url}/api/upload-multer?saveToMongo=true`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // backend returns { data: { success: 1, file: { url, filename, ... } } }
      const receiptUrl: string | undefined = uploadRes?.data?.data?.file?.url;
      // const receiptFilename: string | undefined = uploadRes?.data?.data?.file?.filename;

      if (!receiptUrl) {
        setErrors({ ...errors, [bill.id]: 'Το upload ολοκληρώθηκε αλλά δεν επιστράφηκε URL.' });
        setBusy({ ...busy, [bill.id]: false });
        return;
      }

      // 2) mark bill as PENDING + attach receipt url (expects backend PATCH to accept it)
        await axios.patch(`${url}/api/bills/${bill.id}/pay`, {
          receiptUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refresh list
      await fetchMyBills();
      setUploads({ ...uploads, [bill.id]: null });
    } catch (err: unknown) {
      console.error('submitProof error:', err);
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'Αποτυχία κατά την αποστολή απόδειξης';
        setErrors({ ...errors, [bill.id]: msg });
      } else if (err instanceof Error) {
        setErrors({ ...errors, [bill.id]: err.message });
      } else {
        setErrors({ ...errors, [bill.id]: 'Άγνωστο σφάλμα' });
      }
    } finally {
      setBusy({ ...busy, [bill.id]: false });
    }
  };

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        Οι λογαριασμοί μου
      </Typography>

      {loading && <LinearProgress />}

      <Paper sx={{ mt: 2, overflowX: 'auto' }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Μήνας</TableCell>
              <TableCell>Κτίριο</TableCell>
              <TableCell>Διαμέρισμα</TableCell>
              <TableCell>Σύνολο (€)</TableCell>
              <TableCell>Κατάσταση</TableCell>
              <TableCell>Απόδειξη</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.map((b) => {
              const allowUpload = b.status === 'UNPAID' || b.status === 'CANCELED';
              return (
                <TableRow key={b.id} hover>
                  <TableCell>{b.month}</TableCell>
                  <TableCell>{b.building}</TableCell>
                  <TableCell>{b.flat}</TableCell>
                  <TableCell>{b.amount}</TableCell>
                  <TableCell>
                    <Chip label={b.status} color={STATUS_COLOR[b.status]} size='small' />
                  </TableCell>
                  <TableCell>
                    {allowUpload && (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <input
                          id={`file-${b.id}`}
                          type='file'
                          accept='application/pdf,image/*'
                          style={{ display: 'none' }}
                          onChange={(e) => onFileChange(b.id, e.target.files?.[0] ?? null)}
                        />
                        <label htmlFor={`file-${b.id}`}>
                          <Button variant='outlined' component='span' disabled={!!busy[b.id]}>
                            Επιλογή αρχείου
                          </Button>
                        </label>
                        <Typography variant='body2'>
                          {uploads[b.id]?.name ?? 'κανένα αρχείο'}
                        </Typography>
                        <Button
                          variant='contained'
                          onClick={() => submitProof(b)}
                          disabled={!!busy[b.id]}
                        >
                          Υποβολή για έλεγχο
                        </Button>
                      </Box>
                    )}
                    {!allowUpload && (
                      <Typography variant='body2' sx={{ opacity: 0.7 }}>
                        Δεν απαιτείται απόδειξη
                      </Typography>
                    )}
                    {errors[b.id] && (
                      <Typography variant='caption' color='error' display='block'>
                        {errors[b.id]}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {bills.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant='body2'>Δεν βρέθηκαν λογαριασμοί.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default Userview;
