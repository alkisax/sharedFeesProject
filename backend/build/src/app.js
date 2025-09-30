"use strict";
/* eslint-disable quotes */
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// import rateLimit from 'express-rate-limit';
// import helmet from 'helmet';
const upload_routes_1 = __importDefault(require("./uploadMulter/upload.routes"));
const auth_routes_1 = __importDefault(require("./login/routes/auth.routes"));
const user_routes_1 = __importDefault(require("./login/routes/user.routes"));
const bill_routes_1 = __importDefault(require("./bill//routes/bill.routes"));
const globalBill_routes_1 = __importDefault(require("./bill/routes/globalBill.routes"));
const excel_routes_1 = __importDefault(require("./xlsxParser/excel.routes"));
const app = (0, express_1.default)();
// const allowedOrigins = [
//   `${process.env.FRONTEND_URL}`,
//   `${process.env.BACKEND_URL}`,
//   `${process.env.DEPLOY_URL}`,
//   'https://cloud.appwrite.io', 
// ];
app.use((0, cors_1.default)());
// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return cb(null, true);
//       }
//       return cb(null, false); // simply reject without crashing
//     },
//     // credentials: true, // set true if you use cookies for auth
//   })
// );
app.use(express_1.default.json());
// library for securing. With only helmet() covers: sniffing, clickjacking, HSTS
// app.use(helmet());
// το helmet() δεν μου επέτρεπε να δω τις εικόνες απο το appwrite ή να μπω στο stripe etc. Εδω προσθέτουμε εξαιρέσεις για αυτό
// **ΠΡΟΣΟΧΗ** αυτη είναι η πιθανοτερη πηγη δυσλειτουργίας third party
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: [
//         "'self'",
//         "https://js.stripe.com",
//         "https://www.googletagmanager.com",   // google analytics
//         "https://www.google-analytics.com",
//         "https://www.youtube.com",
//         "https://s.ytimg.com"        
//       ],
//       frameSrc: [
//         "'self'",
//         "https://js.stripe.com",
//         "https://www.google.com",
//         "https://maps.google.com",
//         "https://analytics.google.com",
//         "https://lookerstudio.google.com",
//         "https://www.youtube.com",
//         "https://youtube.com",
//         "https://www.youtube-nocookie.com" 
//       ],
//       // imgSrc: ["'self'", "data:", "https://cloud.appwrite.io", "https://fra.cloud.appwrite.io"], // αυτο λειτουργούσε αλλλα αφαιρέθηκε, **ΝΑ ΠΡΟΣΤΕΘΕΙ ΞΑΝΑ** δες επόμενο σχόλιο
//       imgSrc: [
//         "'self'",
//         "data:",
//         "https://i.ytimg.com",
//         "https://s.ytimg.com",
//         "https://cloud.appwrite.io",
//         "https://fra.cloud.appwrite.io",        
//         "https:"], // η εφαρμογή μου είχε πολλές φωτογραφίες απο διάφορα url απο το ιντερνετ. βάλαμε αυτό γιατί τις έκοβε το helmet αλλα τώρα δεν είναι ασφαλές
//       connectSrc: [
//         "'self'",
//         "https://cloud.appwrite.io",
//         "https://fra.cloud.appwrite.io",
//         "https://region1.google-analytics.com",
//         "https://www.google-analytics.com",
//         "https://www.youtube.com",
//         "https://youtube.com",
//         "https://*.googlevideo.com",
//         "https://*.ytimg.com",
//       ],
//       mediaSrc: [
//         "'self'",
//         "https://*.googlevideo.com",
//       ],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//     },
//   })
// );
// // needs or problems on deploy -helmet-
// app.set('trust proxy', 1);
// app.use((req: Request, _res: Response, next: NextFunction) => {
//   console.log("Request reached Express!");
//   console.log(`Incoming request: ${req.method} ${req.path}`);
//   next();
// });
// global limiter η βιβλιοθήκε αυτή βάζει όριο στο πόσα req θα δεχτεί απο κάθε ip με αποτέλεσμα να εμποδίζει DDOS επιθέσεις
// const globalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 200, // TODO CHANGE BACK!!!// 200 requests / 15 min per IP
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(globalLimiter);
app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.get('/health', (_req, res) => {
    res.send('ok');
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/bills', bill_routes_1.default);
app.use('/api/global-bills', globalBill_routes_1.default);
app.use('/api/excel', excel_routes_1.default);
// app.use('/api/email', emailRoutes);
app.use('/api/upload-multer', upload_routes_1.default);
app.use(express_1.default.static('dist'));
// swagger test page
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// ✅ SERVE UPLOADS BEFORE DIST
// ΠΡΟΣΟΧΗ το ../ στο path είναι συμαντικο. τα αρχεια μας βρίσκονται τελικά στον φάκελο dist
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// // για να σερβίρει τον φακελο dist του front μετα το npm run build
// // app.use(express.static('dist'));
// app.use(express.static(path.join(__dirname, '../../dist')));
// //αυτο είναι για να σερβίρει το index.html του front όταν ο χρήστης επισκέπτεται το root path ή οποιοδήποτε άλλο path που δεν είναι api ή api-docs
// app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
//   // res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//   res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
// });
// run into problems and changed this 👆🏼 to this 👇🏼
// serve frontend build from public/
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.get(/^\/(?!api|api-docs).*/, (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
exports.default = app;
//# sourceMappingURL=app.js.map