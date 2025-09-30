import mongoose from 'mongoose';
import { IBill } from '../types/bill.types';
declare const _default: mongoose.Model<IBill, {}, {}, {}, mongoose.Document<unknown, {}, IBill, {}, {}> & IBill & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
