/* eslint-disable no-console */
import { handleControllerError } from '../../utils/error/errorHandler'
import { globalBillDAO } from '../dao/globalBill.dao'
import { userDAO } from '../../login/dao/user.dao'
import { billDAO } from '../dao/bill.dao'

import type { Request, Response } from 'express'
import type { CreateGlobalBill } from '../types/bill.types'

// create global bill
export const createGlobalBill = async (req: Request, res: Response) => {
  try {
    const data = req.body as CreateGlobalBill
    if (!data.month || !data.building || !data.categories || !data.total) {
      return res.status(400).json({ status: false, message: 'Missing required fields' })
    }

    const newBill = await globalBillDAO.create(data)
    return res.status(201).json({ status: true, data: newBill })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// read all global bills
export const findAllGlobal = async (_req: Request, res: Response) => {
  try {
    const bills = await globalBillDAO.readAll()
    return res.status(200).json({ status: true, data: bills })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// read global bill by id
export const readGlobalById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({ status: false, message: 'no Id provided' })
    }

    const bill = await globalBillDAO.readById(id)
    return res.status(200).json({ status: true, data: bill })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// read only OPEN global bills
export const findOpenGlobal = async (_req: Request, res: Response) => {
  try {
    const bills = await globalBillDAO.readByFilter({ status: "OPEN" });
    return res.status(200).json({ status: true, data: bills });
  } catch (error) {
    return handleControllerError(res, error);
  }
};


// update global bill
export const updateGlobalById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({ status: false, message: 'no Id provided' })
    }

    const data = req.body as Partial<CreateGlobalBill>
    const updatedBill = await globalBillDAO.update(id, data)
    return res.status(200).json({ status: true, data: updatedBill })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// delete global bill (and its user bills)
export const deleteGlobalById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: 'Global bill ID is required' });
    }

    // find the global bill
    const global = await globalBillDAO.readById(id);
    if (!global) {
      return res
        .status(404)
        .json({ status: false, message: 'Global bill not found' });
    }

    // find all child bills
    const bills = await billDAO.findByGlobalBillId(id);

    // if any bills exist → delete one by one so balances adjust
    if (bills.length > 0) {
      for (const bill of bills) {
        // adjust balance for unpaid/pending users
        if (bill.userId && bill.amount) {
          if (bill.status === 'UNPAID' || bill.status === 'PENDING') {
            await userDAO.incrementBalance(bill.userId.toString(), bill.amount);
          }
        }
        // then delete bill
        await billDAO.deleteById(bill.id);
      }
    }

    // finally, delete the global bill itself
    const deletedGlobal = await globalBillDAO.deleteById(id);

    return res.status(200).json({
      status: true,
      message: bills.length
        ? `Global bill and its ${bills.length} bills deleted successfully.`
        : 'Empty global bill deleted successfully.',
      data: deletedGlobal,
    });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

export const globalBillController = {
  createGlobalBill,
  findAllGlobal,
  readGlobalById,
  findOpenGlobal,
  updateGlobalById,
  deleteGlobalById
}
