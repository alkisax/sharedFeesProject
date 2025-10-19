// sharedfees-native\app\_layout.tsx
/*
  1. αυτή η σελίδα λειτουργεί σαν την main. Εδω βάζω αυτά το context που θα τηλίξει την εφαρμογή μου
*/

import { VariablesProvider } from "@/context/variablesContext";
// Stack Navigator component, δηλαδή τον μηχανισμό που δείχνει κάθε οθόνη με “στοίβα” (όπως στο Android: μπαίνεις σε μια σελίδα και πατάς back για να γυρίσεις).
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    // ο wrapper του context
    <VariablesProvider>
      <Stack
        //ό,τι ορίζεις εδώ θα εφαρμόζεται σε κάθε <Stack.Screen>
        // Ορίζει το χρώμα φόντου της μπάρας τίτλου
        screenOptions={{ 
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
      </Stack>
    </VariablesProvider>

  )
}

export default RootLayout
