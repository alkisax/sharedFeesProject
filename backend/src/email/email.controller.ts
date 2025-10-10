//https://resend.com/emails
//https://www.namecheap.com

import type { Request, Response } from 'express'
import { Resend } from 'resend'
import { handleControllerError } from '../utils/error/errorHandler'
import { userDAO } from '../login/dao/user.dao'

const resend = new Resend(process.env.RESEND_API_KEY || '')

// =============================
// 📧 Send email for new bill
// =============================
const sendNewBillEmail = async (req: Request, res: Response) => {
  try {
    const body = req.body || {}
    const userId = body._id
    const user = await userDAO.readById(userId)

    if (!user?.email) {
      return res.status(404).json({ status: false, message: 'User email not found' })
    }

    const lastname = body.lastname || user.lastname || ''
    const emailSubject = body.emailSubject || 'Νέος λογαριασμός κοινοχρήστων'
    const emailTextBody =
      body.emailTextBody ||
      'Αγαπητοί κάτοικοι, θα θέλαμε να σας ενημερώσουμε πως έχει εκδοθεί ένας νέος λογαριασμός κοινοχρήστων. Παρακαλώ επισκεφθείτε https://sharedfeesproject.onrender.com .'

    const result = await resend.emails.send({
      from: 'Shared Fees <noreply@sharedfeesproject.space>',
      to: user.email,
      subject: emailSubject,
      text: `Αγαπητέ/ή ${lastname}, ${emailTextBody}`,
      html: `<p>Αγαπητέ/ή ${lastname},</p><p>${emailTextBody}</p>`,
    })

    return res.status(200).json({ status: true, data: result })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// =============================
// 📧 Notify admin about pending receipt
// =============================
const notifyAdminPending = async (req: Request, res: Response) => {
  try {
    const { billId, building, flat, amount } = req.body
    const adminEmail = process.env.EMAIL_USER

    if (!adminEmail) {
      return res
        .status(400)
        .json({ status: false, message: 'Missing admin email in env' })
    }

    await resend.emails.send({
      from: 'Shared Fees <noreply@sharedfeesproject.space>',
      to: adminEmail,
      subject: `Pending payment review for ${building} - ${flat}`,
      text: `Ένας χρήστης υπέβαλε απόδειξη για τον λογαριασμό ${billId}.
Κτίριο: ${building}
Διαμέρισμα: ${flat}
Ποσό: ${amount} €.
Παρακαλώ ελέγξτε τον πίνακα διαχειριστή.`,
      html: `
        <html lang="el">
          <body style="font-family:sans-serif">
            <p>Ένας χρήστης υπέβαλε απόδειξη για τον λογαριασμό <strong>${billId}</strong>.</p>
            <p>Κτίριο: ${building}<br/>
            Διαμέρισμα: ${flat}<br/>
            Ποσό: ${amount} €.</p>
            <p>Παρακαλώ ελέγξτε τον πίνακα διαχειριστή.</p>
          </body>
        </html>`,
    })

    return res.json({ status: true, message: 'Notification email sent to admin.' })
  } catch (error) {
    return handleControllerError(res, error)
  }
}

// =============================
// 📧 Mass mail to all users in a building (with debug logging)
// =============================
const sendMassEmailToBuilding = async (req: Request, res: Response) => {
  try {
    const { building, emailSubject, emailTextBody, emails } = req.body

    console.log('📨 Mass email request received:', {
      building,
      recipients: emails?.length || 0,
      subject: emailSubject,
    })

    if (!building || !emailSubject || !emailTextBody) {
      console.error('❌ Missing required fields:', { building, emailSubject, emailTextBody })
      return res
        .status(400)
        .json({ status: false, message: 'Missing building or message' })
    }

    if (!emails || emails.length === 0) {
      console.warn('⚠️ No user emails provided for building:', building)
      return res
        .status(404)
        .json({ status: false, message: 'No users with email found for this building' })
    }

    const results = await Promise.allSettled(
      emails.map(async (to: string) => {
        try {
          const response = await resend.emails.send({
            from: 'Shared Fees <noreply@sharedfeesproject.space>',
            to,
            subject: emailSubject || `Νέος λογαριασμός για το κτίριο ${building}`,
            text: emailTextBody,
            html: `<p>${emailTextBody}</p>`,
          })

          console.log(`✅ Email sent to ${to}`, response)
          return response
        } catch (err) {
          console.error(`❌ Failed to send email to ${to}:`, err)
          throw err
        }
      })
    )

    const sent = results.filter(r => r.status === 'fulfilled').length
    const failed = results.length - sent

    console.log(`📊 Mass mail summary for ${building}: sent=${sent}, failed=${failed}`)

    return res.json({
      status: failed === 0,
      message: `Emails sent: ${sent}/${results.length}`,
      failed,
    })
  } catch (error) {
    console.error('🔥 sendMassEmailToBuilding unexpected error:', error)
    return handleControllerError(res, error)
  }
}

export const emailController = {
  sendNewBillEmail,
  notifyAdminPending,
  sendMassEmailToBuilding,
}


/*
   Το update του render με ανάγκασε να σταματήσω να χρησιμοποιώ το nodemailer αλλα κρατάω τον κωδικά του ως σχόλιο   
*/

// import type { Request, Response } from 'express';
// // import nodemailer from 'nodemailer';
// import { handleControllerError } from '../utils/error/errorHandler';
// import { userDAO } from '../login/dao/user.dao';

// // const transporter = nodemailer.createTransport({
// //   host: 'smtp.zoho.eu',
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// const sendNewBillEmail = async (req: Request, res: Response) => {
//   try {
//     const body = req.body || {};
//     const userId = body._id
//     const user = await userDAO.readById(userId)
//     const lastname = body.lastname
//     const email = user.email;
//     const emailSubject: string = body.emailSubject || 'Thank You'; 
//     const emailTextBody: string = body.emailTextBody || 'Αγαπητοί κάτοικοι, θα θέλαμε να σας ενημερώσουμε πως έχει εκδοθεί ένας νέος λογαριασμός κοινοχρήστων. Παρακαλώ επισκευθείτε https://sharedfeesproject.onrender.com .';

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: emailSubject,
//       text: `Dear ${lastname}, ${emailTextBody}`,
//     };

//     const emailRecipt = await transporter.sendMail(mailOptions);
//     return res.status(200).json({ status: true, data: emailRecipt });
//   } catch (error) {
//     return handleControllerError(res, error);
//   }
// };

// const notifyAdminPending = async (req: Request, res: Response) => {
//   try {
//     const { billId, building, flat, amount } = req.body
//     const adminEmail = process.env.EMAIL_USER

//     if (!adminEmail) {
//       return res.status(400).json({ status: false, message: 'Missing admin email in env' })
//     }

//     const subject = `Pending payment review for ${building} - ${flat}`
//     const text = `A user has submitted a receipt for bill ${billId}.\nBuilding: ${building}\nFlat: ${flat}\nAmount: ${amount} €.\nPlease review it in the admin panel.`

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: adminEmail,
//       subject,
//       text,
//     })

//     return res.json({ status: true, message: 'Notification email sent to admin.' })
//   } catch (error) {
//     return handleControllerError(res, error)
//   }
// }

// // 10/10/25 το render εβαλε στο Paid υπηρεσιες σαν το nodemailer https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports
// const sendMassEmailToBuilding = async (req: Request, res: Response) => {
//   try {
//     const { building, emailSubject, emailTextBody } = req.body
//     const emails: string[] = req.body.emails

//     if (!building || !emailSubject || !emailTextBody) {
//       return res.status(400).json({ status: false, message: 'Missing building or message' })
//     }

//     if (emails.length === 0) {
//       return res.status(404).json({ status: false, message: 'No users with email found for this building' })
//     }

//     // send one email per user
//     for (const email of emails) {
//       if (!email) continue
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: emailSubject || `Νέος λογαριασμός για το κτίριο ${building}`,
//         text: emailTextBody,
//       })
//     }

//     return res.json({ status: true, message: `Emails sent to ${emails.length} recipients.` })
//   } catch (error) {
//     return handleControllerError(res, error);
//   }
// }

// export const emailController = {
//   sendNewBillEmail,
//   notifyAdminPending,
//   sendMassEmailToBuilding
// };