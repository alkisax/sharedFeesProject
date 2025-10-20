// sharedfees-native\app\user\index.tsx

import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native'
import { ActivityIndicator, Card, Button, Chip } from 'react-native-paper'
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { useVariables } from '@/context/variablesContext'
import Navbar from '@/components/Navbar'
import type { BillType } from '@/types/nativeApp.types'
import CameraCaptureNative from '@/components/CameraCaptureNative'
import { useAppwriteUploaderNative } from '@/hooks/useAppwriteUploaderNative'
import { FilePickerNative } from  '@/components/FilePickerNative'
import { SafeAreaView } from 'react-native-safe-area-context';
import NotifyAdminButton from '@/components/NotifyAdminButton'

const STATUS_COLOR: Record<BillType['status'], string> = {
  UNPAID: 'orange',
  PAID: 'green',
  PENDING: 'dodgerblue',
  CANCELED: 'gray',
}

const UserView = () => {
  const { url } = useVariables()
  const { ready, uploadFromUri } = useAppwriteUploaderNative()

  const [bills, setBills] = useState<BillType[]>([])
  const [loading, setLoading] = useState(false)
  // κρατά για κάθε bill.id το URI του επιλεγμένου ή τραβηγμένου αρχείου (φωτογραφία/απόδειξη) π.χ. uploads = { "b1": "file:///path/photo.jpg", "b2": null }
  const [uploads, setUploads] = useState<Record<string, string | null>>({})
  // Όταν ο χρήστης πατάει “Υποβολή”, θέλεις να δείξεις loading μόνο στο συγκεκριμένο bill. Αυτό σημαίνει ότι πρέπει να ενημερώσεις ένα κλειδί μέσα στο object busy, χωρίς να χάσεις τα υπόλοιπα.
  const [busy, setBusy] = useState<Record<string, boolean>>({})

  // 🔹 Fetch bills on load
  useEffect(() => {
    const fetchBills = async () => {
      try {
        setLoading(true)
        const token = await SecureStore.getItemAsync('token')
        const res = await axios.get(`${url}/bills/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setBills(res.data.data)
      } catch (err) {
        console.error('Failed to fetch bills', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBills()
  }, [url])

  /*
    📸 Upload Flow Summary (React Native → Appwrite → Backend)

    1️⃣ Ο χρήστης τραβάει ή επιλέγει μια φωτογραφία από τη συσκευή (CameraCaptureNative ή FilePickerNative)
        → αποθηκεύεται προσωρινά στο state `uploads[bill.id]` ως τοπικό URI (π.χ. file:///...)

    2️⃣ Όταν πατηθεί το κουμπί "Υποβολή":
        - η handleSubmit() παίρνει το URI για το συγκεκριμένο bill
        - ελέγχει ότι υπάρχει εικόνα και ότι το Appwrite uploader είναι έτοιμο

    3️⃣ Στέλνει την εικόνα στο Appwrite μέσω του hook useAppwriteUploaderNative:
        - καλεί storage.createFile(APPWRITE_BUCKET_ID, ID.unique(), fileInfo)
        - δημιουργεί δημόσιο link (receiptUrl) προς το αρχείο

    4️⃣ Στη συνέχεια ενημερώνει το backend (PATCH /bills/:id/pay)
        - στέλνει το receiptUrl και το token του χρήστη
        - ο server αποθηκεύει το URL και αλλάζει το status του λογαριασμού (π.χ. σε "PENDING")

    5️⃣ Τέλος, δείχνει επιβεβαίωση στον χρήστη (Alert.alert),
        καθαρίζει το uploads[bill.id] ώστε να μην φαίνεται παλιά φωτογραφία,
        και ο admin μπορεί πλέον να δει την απόδειξη μέσω Appwrite URL.

    ⚙️ Σύνοψη ροής:
        [Camera/File Picker] → [local URI] → [Appwrite Upload] → [receiptUrl] → [Backend PATCH] → [MongoDB update]
  */
  // 🔹 Submit (upload + backend update)
  const handleSubmit = async (bill: BillType) => {
    const uri = uploads[bill.id]
    if (!uri) {
      Alert.alert('⚠️', 'Δεν έχει επιλεγεί φωτογραφία.') // το Alert.alert είναι στην RN ότι το window.alert
      return
    }
    if (!ready) {
      Alert.alert('❌', 'Uploader not ready. Ελέγξτε σύνδεση Appwrite.')
      return
    }

    try {
      setBusy((prev) => ({ ...prev, [bill.id]: true }))

      // 1️⃣ Upload to Appwrite
      const receiptUrl = await uploadFromUri(uri)  // 👈 useAppwriteUploaderNative
      console.log('📎 Uploaded receipt URL:', receiptUrl)

      // 2️⃣ ενημερώνω τον λογαριασμό του χρήστη οτι έγινε το upload
      const token = await SecureStore.getItemAsync('token') // localstorage
      await axios.patch(
        `${url}/bills/${bill.id}/pay`,
        { receiptUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      Alert.alert('✅', 'Απόδειξη υποβλήθηκε με επιτυχία!')
      // θέλουμε να αδειάσουμε την τιμή (το URI) για αυτόν τον λογαριασμό, ώστε:να μην φαίνεται παλιά φωτογραφία στο preview,και να μπορεί ο χρήστης να ανεβάσει άλλη αν χρειαστεί.
      setUploads((prev) => ({ ...prev, [bill.id]: null }))
    } catch (err) {
      console.error('Upload failed:', err)
      Alert.alert('❌', 'Αποτυχία αποστολής απόδειξης.')
    } finally {
      setBusy((prev) => ({ ...prev, [bill.id]: false }))
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating color="#ff8c00" />
      </View>
    )
  }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Navbar />
        {/* το Flatlist είναι κάτι που λειτουργεί σαν το map  */}
        <FlatList
        // Στο React Native, τα scrollable components (όπως ScrollView, FlatList, SectionList) έχουν δύο επίπεδα “κουτιών”: Outer container	Το ίδιο το scrollable element — δηλαδή το πλαίσιο που κάνει scroll	style. Inner container	Το περιεχόμενο μέσα στο scrollable, εκεί που μπαίνουν τα στοιχεία (items)
          contentContainerStyle={styles.list}
          data={bills}
          keyExtractor={(item) => item.id} // αντίστοιχο του key={item.id}
          renderItem={({ item }) => ( //κάνει το map
            <Card style={styles.card}>
              <Card.Title title={`${item.month} - ${item.flat}`} subtitle={item.building} />

              {/* από react-native-paper. Συνήθως περιέχει 3 βασικά «sections» (παιδιά-components): <Card.Title>	Εμφανίζει τίτλο + υπότιτλο	Τίτλος αντικειμένου, όνομα, περιγραφή. <Card.Content>	Το κύριο περιεχόμενο του card	Κείμενο, εικόνες, λίστες, chips κ.λπ.. <Card.Actions>	Περιοχή για κουμπιά */}
              <Card.Content>
                <Text>Σύνολο: €{item.amount}</Text>
                <Chip
                  style={{
                    backgroundColor: STATUS_COLOR[item.status],
                    marginTop: 6,
                    alignSelf: 'flex-start'
                  }}
                >
                  {item.status}
                </Chip>

                {/* 📸 Upload area */}
                {['UNPAID', 'CANCELED'].includes(item.status) && (
                  <View style={styles.uploadSection}>
                    {/* Camera or File buttons stack */}
                    <View style={styles.uploadButtons}>
                      <CameraCaptureNative //👈
                        onCapture={(uri) => {
                          setUploads((prev) => ({ ...prev, [item.id]: uri }))
                        }}
                      />
                      <FilePickerNative //👈
                        // «Όταν το παιδί (FilePickerNative) καλέσει onPick(uri),πάρε αυτό το URI και αποθήκευσέ το στο state uploads για τον συγκεκριμένο λογαριασμό.»
                        onPick={(uri) => setUploads((prev) => ({ ...prev, [item.id]: uri }))}
                      />
                    </View>

                    {/* Optional preview */}
                    {uploads[item.id] && (
                      <View style={styles.previewBox}>
                        <Text style={styles.previewText}>Επιλεγμένο αρχείο:</Text>
                        <Text
                          style={{ color: '#555', fontSize: 12 }}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {uploads[item.id]}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </Card.Content>

              {/* Submit buttons αν δεν είναι paid ή pending  (το item είναι αυτό που κάνουμε map */}
              {['UNPAID', 'CANCELED'].includes(item.status) && (
                <Card.Actions style={styles.actions}>
                  <Button
                    mode="contained"
                    buttonColor="#ff8c00"
                    loading={busy[item.id]}
                    onPress={() => handleSubmit(item)}
                  >
                    Υποβολή
                  </Button>
                </Card.Actions>
              )}

              {item.status === 'PENDING' && (
                <Card.Actions style={styles.actions}>
                  <NotifyAdminButton bill={item} />
                </Card.Actions>
              )}
            </Card>
          )}
        />        
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
    card: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  uploadSection: {
    marginTop: 12,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    flexWrap: 'wrap',
  },
  previewBox: {
    marginTop: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '100%',
  },
  previewText: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 3,
  },
  actions: {
    justifyContent: 'flex-end',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, backgroundColor: '#fff' },
  safeArea: {
    flex: 1,
    backgroundColor: '#d7f5faff', // match your container background
  },
})

export default UserView
