import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  LinearProgress
} from '@mui/material'
import { VariablesContext } from '../context/VariablesContext'

const AdminAnnouncementPanel = () => {
  const { url } = useContext(VariablesContext) // ✅ your backend base URL
  const token = localStorage.getItem('token')

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${url}/api/announcement`)
        if (res.data?.message) {
          setMessage(res.data.message)
        }
      } catch (err) {
        console.error('Failed to fetch announcement', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [url])

  const handleSave = async () => {
    if (!message.trim()) {
      setError('Το πεδίο δεν μπορεί να είναι κενό.')
      return
    }

    try {
      setLoading(true)
      await axios.post(
        `${url}/api/announcement`,
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaved(true)
      setError('')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
      setError('Αποτυχία αποθήκευσης.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`${url}/api/announcement`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMessage('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
      setError('Αποτυχία διαγραφής.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant='h6' gutterBottom>
        📢 Ανακοίνωση
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <TextField
        label='Κείμενο ανακοίνωσης'
        multiline
        fullWidth
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ my: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant='contained' onClick={handleSave}>
          Αποθήκευση
        </Button>
        <Button
          variant='outlined'
          color='error'
          onClick={handleDelete}
          disabled={!message}
        >
          Διαγραφή
        </Button>
      </Box>

      {saved && (
        <Alert sx={{ mt: 2 }} severity='success'>
          Η ανακοίνωση αποθηκεύτηκε!
        </Alert>
      )}
      {error && (
        <Alert sx={{ mt: 2 }} severity='error'>
          {error}
        </Alert>
      )}
    </Box>
  )
}

export default AdminAnnouncementPanel
