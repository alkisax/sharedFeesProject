/* eslint-disable no-console */
import { handleControllerError } from '../../utils/error/errorHandler'
import { globalBillDAO } from '../dao/globalBill.dao'

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

// delete global bill
export const deleteGlobalById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(400).json({ status: false, message: 'no Id provided' })
    }

    const deletedBill = await globalBillDAO.deleteById(id)
    return res.status(200).json({ status: true, data: deletedBill })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

export const globalBillController = {
  createGlobalBill,
  findAllGlobal,
  readGlobalById,
  findOpenGlobal,
  updateGlobalById,
  deleteGlobalById
}
