// sharedfees-native\hooks\useAppwriteUploaderNative.ts

import { useEffect, useState, useCallback } from 'react'
import { account, storage, APPWRITE_BUCKET_ID } from '@/services/appwrite'
import { ID } from 'react-native-appwrite'

export function useAppwriteUploaderNative() {
  const [ready, setReady] = useState(false)

  // φτιάχνουμε ένα ανώνυμο appwrite session (βασικά αυτό θα γίνετε πάντα)
  useEffect(() => {
    const ensureSession = async () => {
      try {
        await account.get()
        setReady(true)
      } catch {
        try {
          await account.createAnonymousSession()
          setReady(true)
        } catch (err) {
          console.error('❌ Failed to create anonymous session:', err)
          setReady(false)
        }
      }
    }
    ensureSession()
  }, [])

  // παίρνει ένα id απο την εικόνα και επιστρέφει το url στο οποίο είναι αποθηκευμένο
  // βλέπει αν είναι Pdf η εικόνα. Φτιάχνει το αρχείο στο format που θέλει το appwrite. κανει το upload στο appwrite με τις εντολές του appwrite
  const uploadFromUri = useCallback(
    async (uri: string) => {
      if (!ready) throw new Error('Uploader not ready')

      const mimeType = uri.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'
      const fileName = uri.endsWith('.pdf')
        ? `receipt_${Date.now()}.pdf`
        : `receipt_${Date.now()}.jpg`

      const fileInfo = {
        uri,
        name: fileName,
        type: mimeType,
        size: 0,
      }

      const uploaded = await storage.createFile({
        bucketId: APPWRITE_BUCKET_ID,
        fileId: ID.unique(),
        file: fileInfo,
      })

      // ✅ αυτο έχει κάποια σημασία γιατι θα σταλθεί στο backend και απο εδώ το βλέπει ο admin
      const receiptUrl = `${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${uploaded.$id}/view?project=${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`

      return receiptUrl
    },
    [ready]
  )

  return { ready, uploadFromUri }
}
