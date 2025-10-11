import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material'

const AdminInstructions = () => {
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Οδηγίες Χρήσης Πίνακα Διαχείρισης
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3 }} color="text.secondary">
          Πρακτικός οδηγός για τη σωστή χρήση του admin panel και τη σωστή μορφοποίηση των δεδομένων.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Section 1 */}
        <Typography variant="h6" gutterBottom>
          📤 Μεταφόρτωση Excel
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Ανεβάστε το αρχείο Excel μέσω του πίνακα «Excel Upload»."
              secondary="Το αρχείο πρέπει να είναι .xlsx ή .xls και να ακολουθεί τη σωστή μορφή (Global Info και User Bills)."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Το όνομα του αρχείου είναι σημαντικό."
              secondary={
                <>
                  Από το όνομα εξάγεται το κτίριο και ο μήνας του λογαριασμού.
                  <br />
                  Παράδειγμα: <strong>Katerinis18_2025_07</strong>
                  <br />
                  • <em>Katerinis18</em> → Building (κτίριο, αγγλικά χωρίς κενά)
                  <br />
                  • <em>2025_07</em> → Μήνας & έτος του λογαριασμού
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Τα ονόματα των πεδίων (στήλες) πρέπει να είναι ακριβώς όπως στο template."
              secondary="Μην αλλάζετε τη δομή ή τις κεφαλίδες."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Από το Excel διαβάζονται δύο περιοχές δεδομένων:"
              secondary={
                <>
                  <strong>GLOBAL_INFO:</strong> D6:F13 → Γενικός λογαριασμός
                  <br />
                  <strong>USER_BILLS:</strong> A15:K26 → Λογαριασμοί ανά διαμέρισμα
                </>
              }
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Section 2 */}
        <Typography variant="h6" gutterBottom>
          🧱 Ονόματα Κτιρίων και Διαμερισμάτων
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Building (Κτίριο)"
              secondary="Χρησιμοποιήστε ΜΟΝΟ αγγλικούς χαρακτήρες χωρίς κενά. Π.χ. Katerinis14, PatraCenter1."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Flat (Διαμέρισμα)"
              secondary="Χρησιμοποιήστε ελληνικά κεφαλαία γράμματα, π.χ. Α1, ΙΣ, Β2."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Section 3 */}
        <Typography variant="h6" gutterBottom>
          👥 Διαχείριση Χρηστών
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Ο πίνακας «Users» επιτρέπει δημιουργία, επεξεργασία και διαγραφή χρηστών."
              secondary="Κατά τη δημιουργία χρήστη, το πεδίο Building/Flat πρέπει να ταιριάζει ακριβώς με αυτά του Excel."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Ως χρήστης ορίζεται το κάθε διαμέρισμα."
              secondary={
                <>
                  Αν ένα διαμέρισμα είναι άδειο ή αλλάξει ενοικιαστή,
                  τροποποιείτε τα πεδία <strong>ονοματεπώνυμου</strong> (firstname, lastname)
                  και <strong>όχι το username</strong>.
                  <br />
                  Το username είναι μόνιμο για το διαμέρισμα.
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Ο διαχειριστής μπορεί να αλλάξει χειροκίνητα υπόλοιπα ή ποσά οφειλής."
              secondary="Αυτό γίνεται μέσα από την καρτέλα του χρήστη στον πίνακα Users."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Διαχείριση κωδικών πρόσβασης"
              secondary={
                <>
                  Είναι ευθύνη του διαχειριστή να δημιουργήσει ή να επαναφέρει
                  password για κάθε ενοικιαστή και να του το παραδώσει.
                  <br />
                  Οι ενοικιαστές δεν έχουν πρόσβαση για αλλαγή του password τους.
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Ρόλοι"
              secondary="Οι διαχειριστές έχουν ρόλο ADMIN, οι κάτοικοι USER. Μπορείτε να αλλάξετε ρόλο με το κουμπί Make/Remove Admin."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Section 4 */}
        <Typography variant="h6" gutterBottom>
          💰 Λογαριασμοί
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Χρησιμοποιήστε το πάνελ «Bills» για να δείτε και να εγκρίνετε αποδείξεις."
              secondary="Μπορείτε να κάνετε Approve, Cancel ή Paid in Cash κάθε λογαριασμό."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Ειδοποιήσεις"
              secondary="Όταν χρήστης ανεβάσει απόδειξη, μπορείτε να λαμβάνετε ειδοποίηση email (Notify Admin)."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Section 5 */}
        <Typography variant="h6" gutterBottom>
          ☁️ Cloud Uploads
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Το πάνελ «Cloud Uploads» δείχνει όλα τα αρχεία που έχουν ανέβει μέσω Appwrite."
              secondary="Μπορείτε να προβάλετε ή να διαγράψετε αρχεία, καθώς και να δείτε τις λεπτομέρειες κάθε upload."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Section 6 */}
        <Typography variant="h6" gutterBottom>
          ✉️ Μαζικά Email
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Από το πάνελ «Bills» μπορείτε να στείλετε μαζικό email σε όλα τα διαμερίσματα ενός κτιρίου."
              secondary="Προσοχή: βεβαιωθείτε ότι όλοι οι χρήστες του κτιρίου έχουν συμπληρωμένο email."
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center">
          Τελευταία ενημέρωση {new Date().toLocaleDateString('el-GR')}
          <br />
          Shared Fees Project — Developed by Π. Κοπακάκης
        </Typography>
      </Paper>
    </Box>
  )
}

export default AdminInstructions
