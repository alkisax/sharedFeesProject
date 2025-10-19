// sharedfees-native\context\UserAuthContext.tsx

import { createContext, useState, useEffect, useContext, useCallback } from 'react'
// ⚠️ στο Mobile δεν μπορούμε να έχουμε lockalStorage και για αυτό έχουμε SecureStore.
// απο εδώ θα πάρουμε τα { getItemAsync, setItemAsync, deleteItemAsync }
import * as SecureStore from 'expo-secure-store'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useVariables } from './variablesContext'
import type { UserType, BackendJwtPayload} from '../types/nativeApp.types'

type UserAuthContextType = {
  user: UserType | null
  setUser: (u: UserType | null) => void
  isLoading: boolean
  setIsLoading: (b: boolean) => void
  logout: () => Promise<void>
}

const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: false,
  setIsLoading: () => {},
  logout: async () => {}
})

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { url } = useVariables()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = useCallback (async () => {
    const token = await SecureStore.getItemAsync('token') //αντί για localhost
    if (!token) return

    try {
      const decoded = jwtDecode<BackendJwtPayload>(token)
      const res = await axios.get(`${url}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(res.data.data)
    } catch (err) {
      console.error('Failed to fetch user:', err)
      await SecureStore.deleteItemAsync('token')
    }
  }, [url])

  const logout = async () => {
    await SecureStore.deleteItemAsync('token')
    setUser(null)
  }

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <UserAuthContext.Provider
      value={{ user, setUser, isLoading, setIsLoading, logout }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = () => useContext(UserAuthContext)
