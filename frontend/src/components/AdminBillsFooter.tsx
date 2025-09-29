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
} from '@mui/material';
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

              <Stack direction='row' spacing={1} alignItems='center'>
                {b.receiptUrl && (
                  <Button
                    size='small'
                    variant='outlined'
                    onClick={() => setViewUrl(b.receiptUrl!)}
                  >
                    View Receipt
                  </Button>
                )}

                {b.status === 'PENDING' && (
                  <>
                    <Button
                      size='small'
                      variant='contained'
                      color='success'
                      onClick={() => handleAction(b.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      color='error'
                      onClick={() => handleAction(b.id, 'cancel')}
                    >
                      Cancel
                    </Button>
                  </>
                )}

                <Chip label={b.status} color={statusColor(b.status)} size='small' />
              </Stack>
            </Box>
          ))}
        </TableCell>
      </TableRow>

      <Dialog open={!!viewUrl} onClose={() => setViewUrl(null)} maxWidth='md' fullWidth>
        <DialogTitle>Receipt Preview</DialogTitle>
        <DialogContent>
          {viewUrl && viewUrl.endsWith('.pdf') ? (
            <iframe
              src={viewUrl}
              style={{ width: '100%', height: '80vh', border: 'none' }}
              title='receipt pdf'
            />
          ) : (
            <img
              src={viewUrl ?? ''}
              alt='receipt'
              style={{ maxWidth: '100%', maxHeight: '80vh' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminBillsFooter;
