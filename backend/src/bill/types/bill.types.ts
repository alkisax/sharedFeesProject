import { Types } from "mongoose";

export type BillStatus = "UNPAID" | "PENDING" | "PAID" | "CANCELED";
// Τύπος που δείχνει την κατάσταση του λογαριασμού (σε εκκρεμότητα, πληρωμένος, εγκρίθηκε από διαχειριστή)

// ------------------- Building-level -------------------

// Αντιπροσωπεύει τον συνολικό/γενικό λογαριασμό της πολυκατοικίας για έναν μήνα
// Δημιουργείται από τον διαχειριστή όταν γίνεται import από excel
export type GlobalBillStatus = "OPEN" | "COMPLETE";
export interface IGlobalBill {
  _id: Types.ObjectId;
  month: string;                // "YYYY-MM"
  building: string;             // e.g. "ΠΟΛΥΚΑΤΟΙΚΙΑ ΚΑΤΕΡΙΝΗΣ 18"
  categories: Record<string, number>; // e.g. { "ΔΕΗ": 152, "Καθαριότητα": 65 }
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Έκδοση view (ασφαλής για API response) του GlobalBill
export interface GlobalBillView {
  id: string;
  month: string;
  building: string;
  categories: Record<string, number>;
  total: number;
  status: GlobalBillStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Δεδομένα που απαιτούνται για να δημιουργηθεί νέος GlobalBill
export interface CreateGlobalBill {
  month: string;
  building: string;
  categories: Record<string, number>;
  total: number;
  status?: GlobalBillStatus;
}

// ------------------- User-level -------------------

// Αντιπροσωπεύει τον ατομικό λογαριασμό κάθε διαμερίσματος/χρήστη
// Περιλαμβάνει ανάλυση εξόδων, μερίδιο, στοιχεία ιδιοκτήτη και κατάσταση πληρωμής
export interface IBill {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  globalBillId: Types.ObjectId; // link to GlobalBill
  month: string;                // "YYYY-MM"
  building: string;             // redundant copy for quick lookup
  flat: string;                 // π.χ. "ΙΣ", "Α1"
  ownerName?: string;           // e.g. "Δρακοπουλου"
  share?: number;               // Χιλιοστά (e.g. 99.7)
  breakdown: Record<string, number>; // per-category costs (ΔΕΗ, Καθαριότητα, κλπ.)
  amount: number;               // Σύνολο
  status: BillStatus;
  paymentMethod?: "CASH" | "BANK" | "OTHER"; // Τρόπος πληρωμής
  paidAt?: Date;  // Ημερομηνία πληρωμής
  receiptUrl?: string;
  notes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Έκδοση view (ασφαλής για API response) του Bill
export interface BillView {
  id: string;
  userId: string;
  globalBillId: string;
  month: string;
  building: string;
  flat: string;
  ownerName?: string;
  share?: number;
  breakdown: Record<string, number>;
  amount: number;
  status: BillStatus;
  paymentMethod?: "CASH" | "BANK" | "OTHER"; // Τρόπος πληρωμής
  paidAt?: Date;  // Ημερομηνία πληρωμής
  receiptUrl?: string;
  notes?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Δεδομένα που απαιτούνται για να δημιουργηθεί νέος Bill για χρήστη
// Χρησιμοποιείται όταν γίνεται import από excel ή admin δημιουργεί νέο λογαριασμό
export interface CreateBill {
  userId: Types.ObjectId;
  globalBillId: Types.ObjectId;
  month: string;
  building: string;
  flat: string;
  ownerName?: string;
  share?: number;
  breakdown: Record<string, number>;
  amount: number;
  status?: BillStatus;
  paymentMethod?: "CASH" | "BANK" | "OTHER"; // Τρόπος πληρωμής
  paidAt?: Date;    // Ημερομηνία πληρωμής
  receiptUrl?: string;
  notes?: string[];
}

// Δεδομένα που μπορούν να ενημερωθούν σε έναν Bill
// Χρησιμοποιείται για ενημέρωση κατάστασης (πληρωμένος/εγκεκριμένος) ή για notes/απόδειξη
export interface UpdateBill {
  status?: BillStatus;
  paymentMethod?: "CASH" | "BANK" | "OTHER" | null; // Τρόπος πληρωμής
  paidAt?: Date | null;   // Ημερομηνία πληρωμής
  receiptUrl?: string | null;
  notes?: string[];
}
