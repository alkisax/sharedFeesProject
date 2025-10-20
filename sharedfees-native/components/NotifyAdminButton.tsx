import React, { useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import { useVariables } from '@/context/variablesContext'
import type { BillType } from '@/types/nativeApp.types'

interface Props {
  bill: BillType
}

const NotifyAdminButton = ({ bill }: Props) => {
  const { url } = useVariables()
  const [loading, setLoading] = useState(false)

  const notifyAdmin = async () => {
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync('token')
      const res = await axios.post(
        `${url}/email/notify-admin`,
        {
          billId: bill.id,
          building: bill.building,
          flat: bill.flat,
          amount: bill.amount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      Alert.alert('✅', res.data.message || 'Εστάλη ειδοποίηση στον διαχειριστή.')
    } catch (err) {
      console.error('notifyAdmin error:', err)
      Alert.alert('❌', 'Αποτυχία αποστολής ειδοποίησης.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      icon="email-outline"
      mode="outlined"
      onPress={notifyAdmin}
      loading={loading}
      textColor="#1976d2"
      style={styles.notifyBtn}
      labelStyle={styles.label}
    >
      Ειδοποίηση Διαχειριστή
    </Button>
  )
}

const styles = StyleSheet.create({
  notifyBtn: {
    marginTop: 6,
    borderColor: '#1976d2',
    borderWidth: 1,
    borderRadius: 8,
    alignSelf: 'flex-start', // δεν γεμίζει όλο το πλάτος
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
})

export default NotifyAdminButton
