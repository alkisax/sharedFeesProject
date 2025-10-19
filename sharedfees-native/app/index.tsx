// sharedfees-native\app\index.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useVariables } from "@/context/variablesContext";
import PatrasImg from './assets/patras-steps.jpg'
import Navbar from '@/components/Navbar';

export default function HomeScreen() {
  const { url } = useVariables()
  const [announcement, setAnnouncement] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/announcement`);
        if (res.data?.message) setAnnouncement(res.data.message);
      } catch (err) {
        console.error('Failed to fetch announcement', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncement();
  }, [url]);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Navbar />
        <ScrollView //Το περιεχόμενο θα κάνει scroll όταν χρειάζεται Αλλά όταν δεν χρειάζεται, το flexGrow: 1
          style={styles.container} //Αυτό το style εφαρμόζεται στο ίδιο το ScrollView
          contentContainerStyle={styles.scrollContent} //Αυτό εφαρμόζεται στο εσωτερικό περιεχόμενο του ScrollView, δηλαδή εκεί που βρίσκονται τα children
        >
          <View>
            <Text style={styles.title}>Καλώς ήρθατε</Text>
            <Text style={styles.subtitle}>
              Εφαρμογή διαχείρισης κοινοχρήστων για πολυκατοικίες.
            </Text>

            <View style={styles.container}>
              <Image
                source={PatrasImg}
                // source={{ uri }}
                style={styles.image}
                resizeMode="cover" // Η εικόνα μεγεθύνεται ή μικραίνει ώστε να καλύπτει ολόκληρο το container.Αν οι αναλογίες (πλάτος / ύψος) της εικόνας δεν ταιριάζουν με του container, τότε κάποιο μέρος της εικόνας κόβεται (crop)
              />          
            </View>

            {loading && <ActivityIndicator size="large" color="#1976d2" />}
            {announcement ? (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>{announcement}</Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.footer}>
            2025 Shared Fees Project — Π. Κοπακάκης · pelopkop@gmail.com
          </Text>
        </ScrollView>
      </SafeAreaView>    
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // fill entire screen
    backgroundColor: '#d7f5faff',
  },

  imageContainer: {
    width: '100%',
    alignItems: 'center'
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 320,
  },

  image: {
    width: 300,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#ccc' 
  },

  footer: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 30,
  },

  alertBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
  },
  alertText: {
    color: '#0d47a1',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#d7f5faff', // match your container background
  },
});

