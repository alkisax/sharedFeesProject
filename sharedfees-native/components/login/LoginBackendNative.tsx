// sharedfees-native\components\login\LoginBackendNative.tsx

import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button, HelperText, ActivityIndicator } from 'react-native-paper'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store' //αντι για Localstorage
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'expo-router'
import { useVariables } from '@/context/variablesContext'
import { useUserAuth } from '@/context/UserAuthContext'

const LoginBackendNative = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { url } = useVariables()
  const { setUser } = useUserAuth()
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      // στέλνει τα credentials για το Login
      const res = await axios.post(`${url}/auth`, { username, password })

      const token = res.data.data.token
      await SecureStore.setItemAsync('token', token) // αντί για localhost

      const decoded: any = jwtDecode(token)

      // κάνει fetch ολες τις πληροφορίες του χρήστη
      const userRes = await axios.get(`${url}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(userRes.data.data)
      router.push('/') // navigate to home after login
    } catch (err: any) {
      console.error('Login failed:', err)
      setError('Invalid credentials or network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />
      {error ? <HelperText type="error">{error}</HelperText> : null}

      {loading ? (
        <ActivityIndicator animating color="#ff8c00" />
      ) : (
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          buttonColor="#ff8c00"
        >
          Login
        </Button>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 40
  },
  input: {
    marginBottom: 15
  },
  button: {
    marginTop: 10,
    paddingVertical: 5
  }
})

export default LoginBackendNative
