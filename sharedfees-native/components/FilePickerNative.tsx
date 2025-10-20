import * as DocumentPicker from 'expo-document-picker' // η βιβλιοθήκη που μας δίνει προσβαση στο fs
import { Button } from 'react-native-paper'
import React from 'react'

// ts εξήγηση: Το component περιμένει prop onPick, που είναι συνάρτηση, και αυτή η συνάρτηση δέχεται ένα string (URI) και δεν επιστρέφει τίποτα (void). H onPick είναι μια συνάρτηση σαν την onClick. 'Οταν διαλεχθει αρχείο'
interface FilePickerProps {
  onPick: (uri: string) => void
}

export const FilePickerNative = ({ onPick }: FilePickerProps) => {
  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ // συνάρτηση του expo-document-picker
        type: ['image/*', 'application/pdf'], 
        copyToCacheDirectory: true, //Αν το αρχείο είναι σε εξωτερική τοποθεσία (π.χ. SD card, iCloud, Google Drive), το αντιγράφει αυτόματα στο cache folder της εφαρμογής.
      })
      if (res.canceled || !res.assets?.length) return // αν είναι canceled ή αν assets είναι undefined ή κενό array (δεν έχει αρχεία).
      const fileUri = res.assets[0].uri
      onPick(fileUri) // εδω καλώ την συνάρητση που ήρθε απο τον Parent (userView) → αποθηκευει το url του αρχείου στο state
    } catch (err) {
      console.error('File picker error', err)
    }
  }

  return (
    <Button icon="file-upload" mode="outlined" onPress={pickFile}>
      Επιλογή
    </Button>
  )
}
