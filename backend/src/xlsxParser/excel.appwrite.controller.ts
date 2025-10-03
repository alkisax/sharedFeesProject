// src/xlsxParser/excel.appwrite.controller.ts
import { Request, Response } from 'express';
import { Client, Storage } from 'node-appwrite';
import path from 'path';
import { handleControllerError } from '../utils/error/errorHandler';
import Bill from '../bill/models/bill.model';
import User from '../login/models/users.models';
import { globalBillDAO } from '../bill/dao/globalBill.dao';
import { userDAO } from '../login/dao/user.dao';
import { parseExcelBuffer } from './parseExcelBuffer';

// ✅ init Appwrite client for server side (with API key)
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

// του appwrite για να διαχειριστούμε το bucket
const storage = new Storage(client);

const uploadExcelAppwrite = async (req: Request, res: Response) => {
  try {
    // το id και το ονομα του αρχείου  όπως έρχονται απο το front
    const { fileId, originalName } = req.body as {
      fileId: string;
      originalName: string;
    };

    if (!fileId || !originalName) {
      return res.status(400).json({ status: false, message: 'Missing fileId or originalName' });
    }

    // 1️⃣ download file as buffer
    // getFileDownload is a method in the Appwrite Storage API that lets you fetch the raw binary content of a file stored in a bucket.
    // Buffer είναι (παράγωγος class) τύπος της js (πχ string HashMap κλπ) για την διαχείρηση binary αρχείων
    const arrayBuffer = await storage.getFileDownload({
      bucketId: process.env.APPWRITE_BUCKET_ID!,
      fileId,
    });

    const buffer = Buffer.from(arrayBuffer);

    // 2️⃣ validate extension
    const ext = path.extname(originalName).toLowerCase();
    if (!['.xlsx', '.xls'].includes(ext)) {
      return res.status(400).json({ status: false, message: 'Only Excel files are allowed' });
    }

    // 3️⃣ parse excel
    const { globalInfo, userBills } = parseExcelBuffer(buffer);

    // 4️⃣ extract building + month from filename
    const [building, year, month] = originalName.replace('.xlsx', '').split('_');
    const billMonth = `${year}-${month}`;

    // 5️⃣ convert globalInfo → categories + total
    const categories: Record<string, number> = {};
    let total = 0;
    for (const row of globalInfo) {
      const key = row[0] as string | null;
      const val = typeof row[2] === 'number' ? row[2] : 0;
      if (key && key.trim() !== 'ΣΥΝΟΨΗ ΕΞΟΔΩΝ' && key.trim() !== 'ΣΥΝΟΛΟ') {
        categories[key.trim()] = val;
      }
      if (key?.trim() === 'ΣΥΝΟΛΟ') {
        total = val;
      }
    }

    // 6️⃣ save GlobalBill
    const globalBill = await globalBillDAO.createServerSide({
      month: billMonth,
      building,
      categories,
      total,
      status: 'OPEN',
    });

    // 7️⃣ create Bills
    const headers = userBills[0] as string[];
    const rows = userBills.slice(1); // αφαιρούμε την πρωτη

    const billsToInsert = (
      await Promise.all(
        rows
          .filter((row) => row[0])
          .map(async (row) => {
            const flat = row[0] as string;
            const ownerName = row[1] as string;
            const share = typeof row[2] === 'number' ? row[2] : undefined;

            let breakdown: Record<string, number> = {};
            for (let i = 3; i < headers.length - 1; i++) {
              const colName = String(headers[i]).trim();
              const raw = row[i];
              if (typeof raw === 'number') {
                breakdown[colName] = raw;
              }
            }

            const amount =
              typeof row[headers.length - 1] === 'number'
                ? (row[headers.length - 1] as number)
                : 0;

            const user = await userDAO.toServerByBuildingAndFlat(
              building,
              flat
            );
            if (!user) {
              console.warn(
                `No user found for flat ${flat}, building ${building}`
              );
              return null;
            }

            return {
              userId: user._id,
              globalBillId: globalBill._id,
              month: billMonth,
              building,
              flat,
              ownerName,
              share,
              breakdown,
              amount,
              status: 'UNPAID',
            };
          })
      )
    ).filter(Boolean);

    // προσθέτουμε τους λογαριασμούς στον κάθε χρήστη
    await Bill.insertMany(billsToInsert);

    for (const b of billsToInsert) {
      if (!b || !b.userId) continue;
      await User.findByIdAndUpdate(
        b.userId,
        { $inc: { balance: -Math.abs(b.amount) } },
        { new: true }
      );
    }

    return res.status(201).json({ status: true, message: 'GlobalBill created successfully', data: { globalInfo, userBills }, });
  } catch (error) {
    console.error('Excel Appwrite upload error:', error);
    return handleControllerError(res, error);
  }
};

export const excelAppwriteController = {
  uploadExcelAppwrite,
};
