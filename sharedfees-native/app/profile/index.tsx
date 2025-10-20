// sharedfees-native\app\profile\index.tsx

import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useUserAuth } from '@/context/UserAuthContext'
import Navbar from '@/components/Navbar'
import { ActivityIndicator, Divider } from 'react-native-paper'

const ProfileScreen = () => {
  const { user, isLoading } = useUserAuth()

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating color="#ff8c00" />
      </View>
    )
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>You must be logged in to view your profile.</Text>
      </View>
    )
  }

  return (
    <>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My Profile</Text>
        <Divider style={styles.divider} />

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>First Name</Text>
          <Text style={styles.value}>{user.firstname || '—'}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Last Name</Text>
          <Text style={styles.value}>{user.lastname || '—'}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email || '—'}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Building</Text>
          <Text style={styles.value}>{user.building || '—'}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Flat</Text>
          <Text style={styles.value}>{user.flat || '—'}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.value}>{user.balance ?? 0}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Created At</Text>
          <Text style={styles.value}>{new Date(user.createdAt ?? '').toLocaleString()}</Text>
        </View>

        <View style={styles.fieldBox}>
          <Text style={styles.label}>Updated At</Text>
          <Text style={styles.value}>{new Date(user.updatedAt ?? '').toLocaleString()}</Text>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  divider: {
    marginBottom: 16
  },
  fieldBox: {
    marginBottom: 12
  },
  label: {
    fontWeight: '600',
    color: '#444'
  },
  value: {
    fontSize: 16,
    color: '#222'
  }
})

export default ProfileScreen
