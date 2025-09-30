import type { IUser, UserView, CreateUserHash, UpdateUser } from '../types/user.types'
import User from '../models/users.models'

// Response DAO (safe to send to client, no hashed pass)
export const toUserDAO = (user: IUser): UserView => {
  return {
    id: user._id.toString(),
    username: user.username,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    phone: user.phone,
    AFM: user.AFM,
    building: user.building,
    flat: user.flat,
    balance: user.balance,
    lastClearedMonth: user.lastClearedMonth,
    notes: user.notes,
    uploadsMongo: user.uploadsMongo?.map((id) => id.toString()),
    uploadsAppwrite: user.uploadsAppwrite,
    roles: user.roles,
    hasPassword: user.hasPassword,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const create = async (userData: CreateUserHash): Promise<UserView> => {
  try {
    const user = new User({
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      phone: userData.phone,
      AFM: userData.AFM,
      building: userData.building,
      flat: userData.flat,
      balance: userData.balance,
      roles: userData.roles ?? ['USER'],
      hashedPassword: userData.hashedPassword
    });

    const response = await user.save();
    if (!response) {
      throw new Error("Error saving user: empty response from Mongo");
    }

    return toUserDAO(response as IUser);
  } catch (err: unknown) {
    console.error("❌ Error creating user:", err);

    // Handle duplicate key errors gracefully
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as any).code === 11000
    ) {
      const dupField = Object.keys((err as any).keyValue || {})[0];
      throw new Error(`Duplicate key error: ${dupField} already exists`);
    }

    throw err;
  }
};


const readAll = async (): Promise<UserView[]> => {
  const users = await User.find()
  return users.map((u) => toUserDAO(u as IUser))
}

const readById = async (userId: string): Promise<UserView> => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return toUserDAO(user as IUser)
}

const readByUsername = async (username: string): Promise<UserView> => {
  const user = await User.findOne({ username })
  if (!user) throw new Error(`User with username ${username} not found`)
  return toUserDAO(user as IUser)
}

const toServerById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId)
  if (!user) throw new Error('User not found')
  return user as IUser
}

const toServerByEmail = async (email: string): Promise<IUser | null> => {
  const user = await User.findOne({ email })
  return user ? (user as IUser) : null
}

const toServerByUsername = async (username: string): Promise<IUser | null> => {
  const user = await User.findOne({ username })
  return user ? (user as IUser) : null
}

const update = async (userId: string, userData: UpdateUser): Promise<UserView> => {
  const response = await User.findByIdAndUpdate(userId, userData, { new: true })
  if (!response) throw new Error('User does not exist')
  return toUserDAO(response as IUser)
}

const toggleRoleById = async (userId: string): Promise<UserView | null> => {
  const user = await User.findById(userId)
  if (!user) return null

  user.roles = user.roles.includes('ADMIN') ? ['USER'] : ['ADMIN']
  user.markModified('roles')
  await user.save({ validateBeforeSave: false })

  return toUserDAO(user as IUser)
}

const deleteById = async (userId: string): Promise<UserView> => {
  const response = await User.findByIdAndDelete(userId)
  if (!response) {
    const error = new Error('User does not exist') as Error & { status?: number }
    error.status = 404
    throw error
  }
  return toUserDAO(response as IUser)
}

// Increment user balance by a given amount
const incrementBalance = async (userId: string, amount: number) => {
  const response = await User.findByIdAndUpdate(
    userId,
    { $inc: { balance: amount } },
    { new: true }
  );
  if (!response) throw new Error('User not found');
  return toUserDAO(response as IUser);
};

// Find user by building + flat (server-side, raw model)
const toServerByBuildingAndFlat = async (building: string, flat: string): Promise<IUser | null> => {
  const user = await User.findOne({ building, flat });
  return user ? (user as IUser) : null;
};

export const userDAO = {
  toUserDAO,
  create,
  readAll,
  readById,
  readByUsername,
  toServerById,
  toServerByEmail,
  toServerByUsername,
  update,
  toggleRoleById,
  deleteById,
  incrementBalance,
  toServerByBuildingAndFlat
}
