import { Box, Typography, Container, Paper } from '@mui/material'
import StepsImg from '../assets/patras-steps.jpg'

const Home = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#d7f5faff', // soft grey matching your navbar icons
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
      }}
    >
      <Container
        maxWidth='md'
        sx={{
          mt: 6,
          mb: 8,
          backgroundColor: '#d7f5faff', // same tone as icons
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
        }}
      >
        {/* Card-style container */}
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            textAlign: 'center',
            backgroundColor: '#fafafa',
          }}
        >
          {/* Title */}
          <Typography
            variant='h4'
            component='h1'
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Καλώς ήρθατε
          </Typography>

          {/* Subtitle */}
          <Typography
            variant='subtitle1'
            color='text.secondary'
            sx={{ mb: 3 }}
          >
            Εφαρμογή διαχείρισης κοινοχρήστων για πολυκατοικίες.
          </Typography>

          {/* Image container */}
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

          {/* Footer note */}
          <Typography variant='body2' color='text.secondary'>
            2025 Shared Fees Project — 
            δημιουργήθηκε από τον Π. Κοπακάκη - pelopkop@gmail.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}

export default Home
