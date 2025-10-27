import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import {
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  LinearProgress,
} from '@mui/material'
import StepsImg from '../assets/patras-steps.jpg'
import { VariablesContext } from '../context/VariablesContext'

const Home = () => {
  const { url } = useContext(VariablesContext) // ✅ backend base URL
  const [announcement, setAnnouncement] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${url}/api/announcement`)
        if (res.data?.message) {
          setAnnouncement(res.data.message)
        }
      } catch (err) {
        console.error('Failed to fetch announcement', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [url])

  return (
    <Box
      sx={{
        backgroundColor: '#d7f5faff',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container
        maxWidth='md'
        sx={{
          mt: 6,
          mb: 4,
          backgroundColor: '#d7f5faff',
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            textAlign: 'center',
            backgroundColor: '#fafafa',
          }}
        >
          <Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
            Καλώς ήρθατε
          </Typography>

          <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 3 }}>
            Εφαρμογή διαχείρισης κοινοχρήστων για πολυκατοικίες.
          </Typography>

          <Box
            sx={{
              width: '100%',
              height: { xs: 300, sm: 400 },
              overflow: 'hidden',
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Box
              component='img'
              src={StepsImg}
              alt='Θέα από τα σκαλάκια του Αγίου Νικολάου, Πάτρα'
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 5s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          </Box>

          <Typography variant='body2' color='text.secondary'>
            2025 Shared Fees Project — δημιουργήθηκε από τον Π. Κοπακάκη · pelopkop@gmail.com
          </Typography>
        </Paper>

        {/* 📢 Announcement section */}
        <Box sx={{ mt: 4 }}>
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          {announcement && (
            <Alert
              severity='info'
              sx={{
                fontSize: '1rem',
                borderRadius: 2,
                backgroundColor: '#ffd57aff',
                color: '#0d47a1',
                py: 2,
                px: 3,
              }}
            >
              {announcement}
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default Home
