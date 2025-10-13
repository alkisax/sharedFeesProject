import { useEffect, useRef, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'
import CameraIcon from '@mui/icons-material/Camera';

interface Props {
  onCapture: (file: File) => void
}

const CameraCapture = ({ onCapture }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setStreaming(true)
    } catch (err) {
      console.error(err)
      setError('Δεν είναι δυνατή η πρόσβαση στην κάμερα')
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach(track => track.stop())
    setStreaming(false)
  }

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const width = videoRef.current.videoWidth
    const height = videoRef.current.videoHeight
    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(videoRef.current, 0, 0, width, height)
    canvas.toBlob(blob => {
      if (blob) {
        const file = new File([blob], `receipt_${Date.now()}.jpg`, { type: 'image/jpeg' })
        onCapture(file)
        stopCamera()
      }
    }, 'image/jpeg', 0.9)
  }
useEffect(() => {
  if (streaming && videoRef.current && videoRef.current.srcObject === null) {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        videoRef.current!.srcObject = stream
        return videoRef.current!.play()
      })
      .catch(err => console.error('reconnect stream failed', err))
  }
}, [streaming])
return (
  <Box sx={{ mt: 1 }}>
    {/* --- initial open/close camera btn --- */}
    {!streaming ? (
      <Button
        variant='outlined'
        startIcon={<CameraAltIcon />}
        onClick={startCamera}
      >
        Photo
      </Button>
    ) : null}

    {error && (
      <Typography variant='caption' color='error' display='block'>
        {error}
      </Typography>
    )}

    {/* --- video + buttons inline --- */}
    {streaming && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          mt: 1,
        }}
      >
        {/* video on the left */}
        <video
          ref={videoRef}
          style={{
            width: '100%',
            maxWidth: 300,
            maxHeight: 240,
            borderRadius: 6,
            objectFit: 'cover',
          }}
          playsInline
          muted
        />
        {/* buttons on the right */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Button
            variant='contained'
            color='success'
            startIcon={<CameraIcon />}
            onClick={takePhoto}
          />
          <Button
            variant='contained'
            color='error'
            startIcon={<CloseIcon />}
            onClick={stopCamera}
          />
        </Box>
      </Box>
    )}

    <canvas ref={canvasRef} style={{ display: 'none' }} />
  </Box>
)

}

export default CameraCapture
