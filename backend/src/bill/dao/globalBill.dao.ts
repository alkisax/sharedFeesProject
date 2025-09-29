import type { IGlobalBill, GlobalBillView, CreateGlobalBill, GlobalBillStatus } from "../types/bill.types";
import GlobalBill from "../models/globalBill.model";

// Response DAO (safe to send to client)
export const toGlobalBillDAO = (bill: IGlobalBill): GlobalBillView => {
  return {
    id: bill._id.toString(),
    month: bill.month,
    building: bill.building,
    categories: bill.categories as Record<string, number>,
    total: bill.total,
    status: bill.status as GlobalBillStatus,
    createdAt: bill.createdAt,
    updatedAt: bill.updatedAt,
  };
};

// Create new GlobalBill
const create = async (billData: CreateGlobalBill): Promise<GlobalBillView> => {
  const bill = new GlobalBill({
    month: billData.month,
    building: billData.building,
    categories: billData.categories,
    total: billData.total,
  });

  const response = await bill.save();
  if (!response) throw new Error("Error saving global bill");

  return toGlobalBillDAO(response as IGlobalBill);
};

// Read all GlobalBills
const readAll = async (): Promise<GlobalBillView[]> => {
  const bills = await GlobalBill.find();
  return bills.map((b) => toGlobalBillDAO(b as IGlobalBill));
};

// Read GlobalBill by ID
const readById = async (id: string): Promise<GlobalBillView> => {
  const bill = await GlobalBill.findById(id);
  if (!bill) throw new Error("GlobalBill not found");
  return toGlobalBillDAO(bill as IGlobalBill);
};

const readByFilter = async (filter: Record<string, unknown>) => {
  return GlobalBill.find(filter).lean();
};

// Internal server-side access
const toServerById = async (id: string): Promise<IGlobalBill> => {
  const bill = await GlobalBill.findById(id);
  if (!bill) throw new Error("GlobalBill not found");
  return bill as IGlobalBill;
};

// Update GlobalBill
const update = async (
  id: string,
  billData: Partial<CreateGlobalBill>
): Promise<GlobalBillView> => {
  const response = await GlobalBill.findByIdAndUpdate(id, billData, { new: true });
  if (!response) throw new Error("GlobalBill does not exist");
  return toGlobalBillDAO(response as IGlobalBill);
};

// Delete GlobalBill
const deleteById = async (id: string): Promise<GlobalBillView> => {
  const response = await GlobalBill.findByIdAndDelete(id);
  if (!response) {
    const error = new Error("GlobalBill does not exist") as Error & { status?: number };
    error.status = 404;
    throw error;
  }
  return toGlobalBillDAO(response as IGlobalBill);
};

export const globalBillDAO = {
  toGlobalBillDAO,
  create,
  readAll,
  readById,
  readByFilter,
  toServerById,
  update,
  deleteById,
};
