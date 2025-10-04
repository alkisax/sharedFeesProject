import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { handleControllerError } from '../utils/error/errorHandler';
import { userDAO } from '../login/dao/user.dao';

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendNewBillEmail = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const userId = body._id
    const user = await userDAO.readById(userId)
    const lastname = body.lastname
    const email = user.email;
    const emailSubject: string = body.emailSubject || 'Thank You'; 
    const emailTextBody: string = body.emailTextBody || 'Αγαπητοί κάτοικοι, θα θέλαμε να σας ενημερώσουμε πως έχει εκδοθεί ένας νέος λογαριασμός κοινοχρήστων. Παρακαλώ επισκευθείτε https://sharedfeesproject.onrender.com .';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailSubject,
      text: `Dear ${lastname}, ${emailTextBody}`,
    };

    const emailRecipt = await transporter.sendMail(mailOptions);
    return res.status(200).json({ status: true, data: emailRecipt });
  } catch (error) {
    return handleControllerError(res, error);
  }
};

const sendMassEmailToBuilding = async (req: Request, res: Response) => {
  try {
    const { building, emailSubject, emailTextBody } = req.body
    const emails: string[] = req.body.emails

    if (!building || !emailSubject || !emailTextBody) {
      return res.status(400).json({ status: false, message: 'Missing building or message' })
    }

    if (emails.length === 0) {
      return res.status(404).json({ status: false, message: 'No users with email found for this building' })
    }

    // send one email per user
    for (const email of emails) {
      if (!email) continue
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: emailSubject || `Νέος λογαριασμός για το κτίριο ${building}`,
        text: emailTextBody,
      })
    }

    return res.json({ status: true, message: `Emails sent to ${emails.length} recipients.` })
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export const emailController = {
  sendNewBillEmail,
  sendMassEmailToBuilding
};