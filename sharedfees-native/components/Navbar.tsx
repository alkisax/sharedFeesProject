// sharedfees-native\components\Navbar.tsx

/*
Το react-native-paper  είναι ένα UI framework για React Native βασισμένο στο Material Design της Google. Δηλαδή σου δίνει έτοιμα όμορφα components όπως:

Appbar → Επικεφαλίδα (header bar)
Button → Κουμπιά 
Card → Κάρτες περιεχομένου
TextInput → Φόρμες εισόδου κειμένου
IconButton, FAB, Snackbar, Dialog κ.ά.

Το Appbar είναι ένα σύνολο components για να φτιάξεις γρήγορα μια μπάρα στο πάνω μέρος της οθόνης. Περιλαμβάνει:

Appbar.Header	Το container της μπάρας
Appbar.Content	Ο τίτλος στο κέντρο
Appbar.Action	Εικονίδιο-κουμπί (π.χ. home, login)
Appbar.BackAction	Εικονίδιο “πίσω”
*/
import { Appbar } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'
import { useUserAuth } from '@/context/UserAuthContext'

const Navbar = () => {
  const router = useRouter()
  const { user, logout } = useUserAuth()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <Appbar.Header
      style={styles.header}
      // statusBarHeight={Platform.OS === 'android' ? StatusBar.currentHeight : 0}
      statusBarHeight={0}
    >
      <Appbar.Action
        icon='home'
        color='white'
        onPress={() => router.push('/')}
      />

      <Appbar.Content
        title='Shared Fees'
        titleStyle={styles.title}
      />

      {/* 📄 My Bills (only for non-admin users) */}
      {user && !user.roles?.includes('ADMIN') && (
        <Appbar.Action
          icon='file-document-outline' // or 'receipt' depending on icon pack
          color='white'
          onPress={() => router.push('/user')}
        />
      )}

      {/* 👑 Admin Panel (if user has ADMIN role) */}
      {user && user.roles?.includes('ADMIN') && (
        <Appbar.Action
          icon='shield-account'
          color='white'
          // onPress={() => router.push('/admin')}
        />
      )}      

      {user ? (
        <>
          {/* Profile icon */}
          <Appbar.Action
            icon='account-circle'
            color='white'
            onPress={() => router.push('/profile')}
          />

          {/* Logout icon */}
          <Appbar.Action
            icon='logout'
            color='white'
            onPress={handleLogout}
          />
        </>
      ) : (
        /* Login icon */
        <Appbar.Action
          icon='login'
          color='white'
          onPress={() => router.push('/login')}
        />
      )}
    </Appbar.Header>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff8c00',
    elevation: 4,
    shadowOpacity: 0.3,
    width: '100%',
    margin: 0,
    padding: 0,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    // textAlign: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
})

export default Navbar

