import { Types } from 'mongoose'
import type { Request } from 'express'

// full user document in Mongo
export interface IUser {
  _id: Types.ObjectId
  username: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string[]           // τηλεφωνα σε array
  AFM?: string               // ΑΦΜ
  building?: string          // κτίριο
  flat?: string              // διαμέρισμα
  balance?: number           // υπόλοιπο
  lastClearedMonth?: Date    // τελευταίος εξοφλημένος μήνας
  notes?: string[]           // σημειώσεις
  uploadsMongo?: Types.ObjectId[]
  uploadsAppwrite?: string[]
  roles: Roles[]
  hashedPassword: string
  hasPassword?: boolean
  createdAt: Date
  updatedAt: Date
}

// ρόλοι χρήστη
export type Roles = 'USER' | 'ADMIN'

// no hashed pass so as user can view
export interface UserView {
  id: string
  username: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string[]
  AFM?: string               
  building?: string          
  flat?: string              
  balance?: number           
  lastClearedMonth?: Date    
  notes?: string[]           
  uploadsMongo?: string[]
  uploadsAppwrite?: string[]
  roles: Roles[]
  hasPassword?: boolean
  createdAt: Date
  updatedAt: Date
}

// for creating a user with plain password (controller -> service)
export interface CreateUser {
  username: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string[]
  AFM?: string
  building?: string
  flat?: string
  balance?: number
  password: string
  roles?: Roles[]
}

// for creating a user with a hashed pass
export interface CreateUserHash {
  username: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string[]
  AFM?: string
  building?: string
  flat?: string
  balance?: number
  hashedPassword: string
  roles?: Roles[]
}

// for updating a user
export interface UpdateUser {
  username?: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string[]
  AFM?: string
  building?: string
  flat?: string
  balance?: number
  lastClearedMonth?: Date
  notes?: string[]
  uploadsMongo?: Types.ObjectId[]
  uploadsAppwrite?: string[]
  roles?: Roles[]
  password?: string        // optional, will be hashed if present
  hashedPassword?: string
}

// φτιαχτηκε γιατί το middleware δεν επέτρεπε req: Request
export interface AuthRequest extends Request {
  user?: UserView
}

export interface JwtPayloadUser {
  id: string
  username: string
  email?: string
  roles: Roles[]
  hasPassword: boolean
}


