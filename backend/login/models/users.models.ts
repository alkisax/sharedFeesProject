import mongoose, { model } from 'mongoose';
import { IUser } from '../types/user.types'

const Schema = mongoose.Schema;
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: true
    },
    firstname: { type: String, required: false },
    lastname: { type: String, required: false },
    email: { type: String, 
      required: false,
      unique: true,
      sparse: true  // allow duplycate nulls
    },
    phone: [{ type: String }],
    AFM: { type: String },
    building: { type: String },
    flat: { type: String },
    balance: { type: Number, default: 0 },
    lastClearedMonth: { type: Date },
    notes: [{ type: String }],
    uploadsMongo: [{ type: Schema.Types.ObjectId, ref: 'Upload' }],
    uploadsAppwrite: [{ type: String }],
    roles: {
      type: [String],
      enum: ['USER', 'ADMIN'],
      default: ['USER']
    },
    hashedPassword: {
      type: String,
      required: [true, 'password is required']
    },
    hasPassword: { type: Boolean, default: true }
  },
  {
    collection: 'users',
    timestamps: true
  }
)

export default model<IUser>('User', userSchema)