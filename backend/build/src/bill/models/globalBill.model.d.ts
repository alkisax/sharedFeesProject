import mongoose from 'mongoose';
import { IGlobalBill } from '../types/bill.types';
declare const _default: mongoose.Model<IGlobalBill, {}, {}, {}, mongoose.Document<unknown, {}, IGlobalBill, {}, {}> & IGlobalBill & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default _default;
