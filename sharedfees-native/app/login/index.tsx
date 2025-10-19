// sharedfees-native\app\login\index.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '@/components/Navbar';
import LoginBackendNative from '@/components/login/LoginBackendNative'

const LoginScreen = () => {
  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <Navbar />
        <View style={styles.container}>
          <Text style={styles.text}>Login</Text>
          <LoginBackendNative />
        </View>
      </SafeAreaView>      
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#d7f5faff', // match your container background
  },
});

export default LoginScreen;
