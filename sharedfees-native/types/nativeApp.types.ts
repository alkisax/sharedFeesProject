export interface BackendJwtPayload {
  id: string
  username: string
  email?: string
  roles: string[]
  hasPassword: boolean
  iat?: number
  exp?: number
}


export interface UserType {
  id: string
  username: string
  firstname?: string
  lastname?: string
  email?: string
  building?: string
  flat?: string
  roles?: string[]
}