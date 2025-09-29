export type Roles = 'USER' | 'ADMIN'

export interface BackendJwtPayload {
  id: string;
  username: string;
  email?: string;
  roles: Roles[];
  hasPassword: boolean;
  iat?: number;
  exp?: number;
}

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