/* eslint-disable no-console */
import { handleControllerError } from '../../utils/error/errorHandler'
import { billDAO } from '../dao/bill.dao'
import User from '../../login/models/users.models'

import type { Request, Response } from 'express'
import type { AuthRequest } from '../../login/types/user.types'
import type { CreateBill, IBill, UpdateBill } from '../types/bill.types'

// create user-level bill
export const createBill = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateBill
    if (!data.userId || !data.globalBillId || !data.month || !data.amount) {
      return res.status(400).json({ status: false, message: 'Missing required fields' })
    }

    const newBill = await billDAO.create(data)
    return res.status(201).json({ status: true, data: newBill })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// get all bills (admin)
export const findAllBills = async (_req: Request, res: Response) => {
  try {
    const bills = await billDAO.readAll()
    return res.status(200).json({ status: true, data: bills })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// get bills for logged-in user
export const findMyBills = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ status: false, message: 'Unauthorized' })
    }

    const bills = await billDAO.readByUser(user.id)
    return res.status(200).json({ status: true, data: bills })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// mark bill as paid (user)
export const markBillAsPaid = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user
    const billId = req.params.id
    const { receiptUrl } = req.body;

    if (!user) {
      return res.status(401).json({ status: false, message: 'Unauthorized' })
    }
    if (!billId) {
      return res.status(400).json({ status: false, message: 'Bill ID is required' })
    }

    // only allow user to pay their own bill
    const bill = await billDAO.toServerById(billId)
    if (bill.userId.toString() !== user.id && !user.roles.includes('ADMIN')) {
      return res.status(403).json({ status: false, message: 'Forbidden: Cannot update other users bills' })
    }

    const update: Partial<IBill> = { status: 'PENDING' };
    if (receiptUrl) {
      update.receiptUrl = receiptUrl;
    }

    const updated = await billDAO.update(billId, update);
    return res.status(200).json({ status: true, data: updated });
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// approve bill (admin)
export const approveBill = async (req: AuthRequest, res: Response) => {
  try {
    const billId = req.params.id;
    if (!billId) {
      return res.status(400).json({ status: false, message: "Bill ID is required" });
    }

    // find the bill first
    const bill = await billDAO.toServerById(billId);
    if (!bill) {
      return res.status(404).json({ status: false, message: "Bill not found" });
    }

    // update the bill status
    const updated = await billDAO.update(billId, { status: "PAID" });

    // credit back to user balance
    // db actions should be in dao TODO
    await User.findByIdAndUpdate(
      bill.userId,
      { $inc: { balance: Math.abs(bill.amount) } }, // ✅ add back amount
      { new: true }
    );

    return res.status(200).json({ status: true, data: updated });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

// cancel bill
export const cancelBill = async (req: AuthRequest, res: Response) => {
  try {
    const billId = req.params.id;
    if (!billId) return res.status(400).json({ status: false, message: 'Bill ID is required' });

    const updated = await billDAO.update(billId, { status: "CANCELED" });
    return res.status(200).json({ status: true, data: updated });
  } catch (error) {
    return handleControllerError(res, error);
  }
};



// update bill (admin use)
export const updateBillById = async (req: Request, res: Response) => {
  try {
    const billId = req.params.id
    if (!billId) {
      return res.status(400).json({ status: false, message: 'Bill ID is required' })
    }

    const data = req.body as UpdateBill
    const updated = await billDAO.update(billId, data)
    return res.status(200).json({ status: true, data: updated })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// delete bill
export const deleteBillById = async (req: Request, res: Response) => {
  try {
    const billId = req.params.id
    if (!billId) {
      return res.status(400).json({ status: false, message: 'Bill ID is required' })
    }

    const deleted = await billDAO.deleteById(billId)
    return res.status(200).json({ status: true, data: deleted })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export const billController = {
  createBill,
  findAllBills,
  findMyBills,
  markBillAsPaid,
  approveBill,
  updateBillById,
  cancelBill,
  deleteBillById
}
