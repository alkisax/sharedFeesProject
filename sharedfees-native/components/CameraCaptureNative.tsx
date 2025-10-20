// sharedfees-native\components\CameraCaptureNative.tsx

import { useState, useRef } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import { Button } from 'react-native-paper'

const CameraCaptureNative = ({ onCapture }: { onCapture: (uri: string) => void }) => {
  const [permission, requestPermission] = useCameraPermissions()
  const [isActive, setIsActive] = useState(false)
  const cameraRef = useRef<CameraView | null>(null)

  const takePhoto = async () => {
    // Αν η κάμερα δεν είναι έτοιμη (ref άδειο), μην κάνεις τίποτα
    if (!cameraRef.current) return

    // 📸 Τράβηξε τη φωτογραφία — quality 0.7 μειώνει μέγεθος αρχείου χωρίς μεγάλη απώλεια
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 })

    // 🪄 Resize + συμπίεση φωτογραφίας
    // Το manipulateAsync κάνει επεξεργασία εικόνας (resize, rotate, crop, compress)
    // Εδώ τη μικραίνουμε ώστε να έχει max πλάτος 1024px και συμπίεση 60%
    // Το SaveFormat.JPEG εξασφαλίζει ότι το αποτέλεσμα θα είναι .jpg
    const resized = await ImageManipulator.manipulateAsync(
      photo.uri, // το αρχικό path της φωτογραφίας
      [{ resize: { width: 1024 } }], // ενέργειες: resize κρατώντας aspect ratio
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG } // επιλογές αποθήκευσης
    )

    // 🔗 Στέλνουμε το νέο URI (τοπικό path του resized αρχείου) πίσω στον parent component
    onCapture(resized.uri)

    // 🔒 Κλείνουμε την κάμερα και επιστρέφουμε στην προηγούμενη οθόνη
    setIsActive(false)
  }

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Απαιτείται άδεια κάμερας</Text>
        <Button onPress={requestPermission}>Επιτρέψτε κάμερα</Button>
      </View>
    )
  }

  if (!isActive) {
    return (
      <Button icon="camera" mode="outlined" onPress={() => setIsActive(true)}>
        Photo
      </Button>
    )
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.buttons}>
        <Button mode="contained" onPress={takePhoto} buttonColor="#4caf50">
          Λήψη
        </Button>
        <Button mode="contained" onPress={() => setIsActive(false)} buttonColor="#f44336">
          Κλείσιμο
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  camera: { width: 300, height: 250, borderRadius: 12, marginVertical: 10 },
  buttons: { flexDirection: 'row', justifyContent: 'space-around', width: 280 },
  center: { alignItems: 'center', justifyContent: 'center' }
})

export default CameraCaptureNative
