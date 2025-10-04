import { useContext, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material'
import axios from 'axios'
import { VariablesContext } from "../context/VariablesContext";


interface Props {
  building: string
  emails: string[] // provided by parent (from billsMap)
}

const AdminBuildingMailer = ({ building, emails }: Props) => {
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState(`Νέος λογαριασμός για το κτίριο ${building}`)
  const [body, setBody] = useState(
    'Αγαπητοί κάτοικοι, θα θέλαμε να σας ενημερώσουμε πως έχει εκδοθεί ένας νέος λογαριασμός κοινοχρήστων. Παρακαλώ επισκευθείτε https://sharedfeesproject.onrender.com .'
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { url } = useContext(VariablesContext);

  const handleSend = async () => {
    if (emails.length === 0) {
      setMessage('Δεν υπάρχουν διαθέσιμα email για αυτό το κτίριο.')
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        `${url}/api/email/send-mass`,
        { building, emailSubject: subject, emailTextBody: body, emails },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(res.data.message || 'Emails sent successfully.')
    } catch (err: unknown) {
      console.error('Error sending emails:', err)
      setMessage('Αποτυχία αποστολής email.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSubject(`Νέος λογαριασμός για το κτίριο ${building}`)
  }, [building])

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setOpen(prev => !prev)}
      >
        {open ? 'Ακύρωση' : 'Send mail to building flats'}
      </Button>

      <Collapse in={open}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            border: '1px solid #ccc',
            bgcolor: '#fafafa',
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Subject"
              variant="outlined"
              fullWidth
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
            <TextField
              label="Body"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={body}
              onChange={e => setBody(e.target.value)}
            />

            <Button
              variant="contained"
              color="success"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Send'}
            </Button>

            {message && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {message}
              </Alert>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  )
}

export default AdminBuildingMailer
