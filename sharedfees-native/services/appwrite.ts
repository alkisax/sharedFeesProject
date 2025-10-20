// sharedfees-native\services\appwrite.ts
// εδώ κάνει initialise το appwrite (το account δεν χρειάζετε στην εφαρμογή αλλα δεν πειράζει)

import { Client, Account, Storage } from 'react-native-appwrite'
import { Platform } from 'react-native'


// --- Config ---
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!
const APPWRITE_PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!
const APPWRITE_BUCKET_ID = process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!

// --- Init client ---
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

// Tell Appwrite which app is calling it
if (Platform.OS === 'android') {
  client.setPlatform('host.exp.exponent')  // Expo Go package name
} else if (Platform.OS === 'ios') {
  client.setPlatform('com.sharedfees.ios') // placeholder if you ever add iOS
}

// --- Export core SDKs ---
const account = new Account(client)
const storage = new Storage(client)

export { client, account, storage, APPWRITE_BUCKET_ID }

