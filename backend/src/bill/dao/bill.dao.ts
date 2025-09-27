import type { IBill, BillView, CreateBill, UpdateBill } from '../types/bill.types'
import Bill from '../models/bill.model'

// Response DAO (safe to send to client)
export const toBillDAO = (bill: IBill): BillView => {
  return {
    id: bill._id.toString(),
    userId: bill.userId.toString(),
    globalBillId: bill.globalBillId.toString(),
    month: bill.month,
    building: bill.building,
    flat: bill.flat,
    ownerName: bill.ownerName,
    share: bill.share,
    breakdown: bill.breakdown as Record<string, number>,
    amount: bill.amount,
    status: bill.status,
    receiptUrl: bill.receiptUrl,
    notes: bill.notes,
    createdAt: bill.createdAt,
    updatedAt: bill.updatedAt
  }
}

// Create new Bill (user-level)
const create = async (billData: CreateBill): Promise<BillView> => {
  const bill = new Bill({
    userId: billData.userId,
    globalBillId: billData.globalBillId,
    month: billData.month,
    building: billData.building,
    flat: billData.flat,
    ownerName: billData.ownerName,
    share: billData.share,
    breakdown: billData.breakdown,
    amount: billData.amount,
    status: billData.status ?? 'PENDING',
    receiptUrl: billData.receiptUrl,
    notes: billData.notes
  })

  const response = await bill.save()
  if (!response) throw new Error('Error saving bill')
  return toBillDAO(response as IBill)
}

// Read all Bills
const readAll = async (): Promise<BillView[]> => {
  const bills = await Bill.find()
  return bills.map((b) => toBillDAO(b as IBill))
}

// Read Bill by ID
const readById = async (id: string): Promise<BillView> => {
  const bill = await Bill.findById(id)
  if (!bill) throw new Error('Bill not found')
  return toBillDAO(bill as IBill)
}

// Read Bills by User
const readByUser = async (userId: string): Promise<BillView[]> => {
  const bills = await Bill.find({ userId })
  return bills.map((b) => toBillDAO(b as IBill))
}

// Internal server-side access
const toServerById = async (id: string): Promise<IBill> => {
  const bill = await Bill.findById(id)
  if (!bill) throw new Error('Bill not found')
  return bill as IBill
}

// Update Bill
const update = async (id: string, billData: UpdateBill): Promise<BillView> => {
  const response = await Bill.findByIdAndUpdate(id, billData, { new: true })
  if (!response) throw new Error('Bill does not exist')
  return toBillDAO(response as IBill)
}

// Delete Bill
const deleteById = async (id: string): Promise<BillView> => {
  const response = await Bill.findByIdAndDelete(id)
  if (!response) {
    const error = new Error('Bill does not exist') as Error & { status?: number }
    error.status = 404
    throw error
  }
  return toBillDAO(response as IBill)
}

export const billDAO = {
  toBillDAO,
  create,
  readAll,
  readById,
  readByUser,
  toServerById,
  update,
  deleteById
}
