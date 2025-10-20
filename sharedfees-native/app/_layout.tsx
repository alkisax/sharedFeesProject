// sharedfees-native\app\_layout.tsx
/*
  1. αυτή η σελίδα λειτουργεί σαν την main. Εδω βάζω αυτά το context που θα τηλίξει την εφαρμογή μου
*/

import { UserProvider } from "@/context/UserAuthContext";
import { VariablesProvider } from "@/context/variablesContext";
// Stack Navigator component, δηλαδή τον μηχανισμό που δείχνει κάθε οθόνη με “στοίβα” (όπως στο Android: μπαίνεις σε μια σελίδα και πατάς back για να γυρίσεις).
import { Stack } from "expo-router";
import 'react-native-url-polyfill/auto' // αυτό το χρειαζόμαστε για το appwrite upload. δεν είμαι σιγουρος τι κάνει

const RootLayout = () => {
  return (
    // ο wrapper του context
    <VariablesProvider>
      <UserProvider>
        <Stack
          //ό,τι ορίζεις εδώ θα εφαρμόζεται σε κάθε <Stack.Screen>
          // Ορίζει το χρώμα φόντου της μπάρας τίτλου
          screenOptions={{ 
          headerShown: false,   // 👈 αυτό μου κρύβει το αυτοματο navbar του expo. αποφασισα να το κάνω αυτό γιατί έυτιαξα δικό μου custom Navbar στο sharedfees-native\components\Navbar.tsx
          headerStyle: {
            backgroundColor: '#ff8c00'
          },
          // χρώμα του κειμένου και των icons
          headerTintColor: '#fff',
          // στυλ του τίτλου στο header
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          },
          // headerRight: () => <HeaderLogout />,
          // το περιεχόμενο της οθόνης (όχι το header).
          contentStyle: {
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: '#fff'
          },
        }}
        >
          {/* Στο Expo Router, κάθε αρχείο μέσα στον φάκελο app/ αντιστοιχεί σε μία οθόνη (route). */}
          <Stack.Screen name='index' options= {{ title: 'Home'}} />
          <Stack.Screen name="login/index" options={{ title: 'Login' }} />
          <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
          <Stack.Screen name="user/index" options={{ title: 'Οι Λογαριασμοί Μου' }} />
        </Stack>        
      </UserProvider>

    </VariablesProvider>

  )
}

export default RootLayout
