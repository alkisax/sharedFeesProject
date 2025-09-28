import { createContext } from "react";
import type { ReactNode } from "react";

// 📝 Ορίζουμε ένα interface με τους τύπους που θα έχει το context μας.
// Δηλαδή τι δεδομένα θα "μοιράζονται" τα components που θα το χρησιμοποιούν.
interface VariablesContextTypes {
  url: string;
}

// 📝 Ορίζουμε τους τύπους για το Provider. 
// Στην ουσία, δίνουμε React children (δηλαδή όλο το App) μέσα στο Provider.
export interface VariablesProviderProps {
  children: ReactNode;
}

// 📝 Εδώ δημιουργούμε το context με ένα default value (εδώ url: "")
// Αυτό είναι το "κουτί" όπου θα αποθηκευτούν τα δεδομένα που θέλουμε να είναι global.
// Σημείωση: Θα μπορούσε να βρίσκεται σε ξεχωριστό αρχείο (π.χ. variablesContext.ts)
// για καθαρότερο διαχωρισμό, αλλά δεν είναι υποχρεωτικό.
export const VariablesContext = createContext<VariablesContextTypes>({
  url: "",
});

// 📝 Ο Provider είναι διαφορετικός από το Context: 
// - Το Context είναι ο "ορισμός" (σαν συμβόλαιο).
// - Ο Provider είναι το "περιτύλιγμα" που θα βάλουμε γύρω από το App μας
//   ώστε να δώσει πραγματικές τιμές στο Context.
export const VariablesProvider = ({ children }: VariablesProviderProps) => {
  // 📝 Εδώ φτιάχνουμε την τιμή που θα μοιραστεί.
  // Στην περίπτωσή μας είναι απλά το url του backend από .env ή fallback σε localhost.
  const url: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  return (
    // 📝 Αυτό είναι το "envelope" που τυλίγει το App στο main.tsx.
    // Μέσα από αυτό, όλα τα children components μπορούν να κάνουν useContext(VariablesContext)
    // και να πάρουν το url.
    <VariablesContext.Provider value={{ url }}>
      {children}
    </VariablesContext.Provider>
  );
};
