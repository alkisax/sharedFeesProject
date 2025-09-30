"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadController = void 0;
/* eslint-disable no-console */
// fs = files system
const fs_1 = require("fs"); // note: require fs.promises
// Node.js's built-in path module, which helps you safely work with file and folder paths
const path_1 = __importDefault(require("path"));
const upload_dao_1 = __importDefault(require("./upload.dao"));
const errorHandler_1 = require("../utils/error/errorHandler");
const multer_service_1 = require("./multer.service");
const BACKEND_URL = process.env.BACKEND_URL;
const renderUploadPage = async (_req, res) => {
    try {
        const items = await upload_dao_1.default.getAllUploads();
        console.log('Mongo items count:', items.length);
        res.status(200).json({ status: true, data: items });
    }
    catch (error) {
        (0, errorHandler_1.handleControllerError)(res, error);
    }
};
const uploadFile = async (req, res) => {
    console.log('enter uploadFile controller');
    //ελενγχουμε το req απο τον client αν έχει οτι χρειάζεται
    if (!req?.file?.path) {
        return res.status(400).json({ status: false, message: 'Missing required fields' });
    }
    const saveToMongo = String(req.query.saveToMongo) === 'true';
    try {
        if (saveToMongo) {
            // το filepath και το obj τα παίρνουμε από το req.file που έχει δημιουργηθεί από το multer middleware
            const filePath = req.file.path;
            console.log('File path:', filePath);
            //Όταν το readFile() τελειώσει: Αν όλα πήγαν καλά, αποθηκεύει το περιεχόμενο του αρχείου (σε μορφή Buffer) στη μεταβλητή data. Αυτός ο Buffer είναι το "raw binary" του αρχείου. Αν και το multer έχει ήδη αποθηκεύσει το αρχείο στο φάκελο uploads, εμείς εδώ το διαβάζουμε ξανά: 👉 για να το μετατρέψουμε σε binary δεδομένα,👉 ώστε να το αποθηκεύσουμε μέσα στη MongoDB (σε ένα document, όχι ως αρχείο στο δίσκο).
            // Συμαντικό: για να λειτουργήσει το fs.readFile() πρέπει να χρησιμοποιήσουμε την υπόσχεση (Promise) του fs.promises, όχι το απλό fs: επάνω στις δηλώσεις: const fs = require('fs').promises;
            const data = await fs_1.promises.readFile(filePath);
            console.log('data:', data);
            const obj = {
                name: req.body.name,
                desc: req.body.desc || '',
                file: {
                    data,
                    contentType: req.file.mimetype,
                    originalName: req.file.originalname,
                    filename: req.file.filename,
                    size: req.file.size,
                    extension: path_1.default.extname(req.file.originalname).slice(1)
                }
            };
            console.log('Upload object:', obj);
            // εδω με το uploadDao το στελνουμε στην mongo ή αποθήκευση ως αρχείο έχει γίνει ήδη απο τον multer middleware
            const saved = await upload_dao_1.default.createUpload(obj);
            // το res πρέπει να γίνει σε άλλη μορφή για να ταιριάζει με τις προυποθέσεις του editroJs
            return res.status(200).json({
                status: true,
                data: {
                    success: 1,
                    file: {
                        url: `${BACKEND_URL}/uploads/${req.file.filename}`,
                        name: saved.name,
                        size: saved.file.size,
                        contentType: saved.file.contentType,
                        extension: saved.file.extension,
                        originalName: saved.file.originalName,
                        filename: saved.file.filename
                    },
                }
            });
        }
        else {
            return res.status(200).json({
                status: true,
                data: {
                    success: 1,
                    file: {
                        url: `${process.env.BACKEND_URL}/uploads/${req.file.filename}`,
                        name: req.file.originalname,
                        size: req.file.size,
                        contentType: req.file.mimetype,
                        extension: path_1.default.extname(req.file.originalname).slice(1),
                        originalName: req.file.originalname,
                        filename: req.file.filename
                    },
                },
            });
        }
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
const deleteUpload = async (req, res) => {
    try {
        const { id } = req.params;
        const upload = await upload_dao_1.default.deleteUpload(id);
        if (!upload) {
            return res.status(404).json({ status: false, message: 'File not found' });
        }
        // Remove the file from disk (uploads folder)
        const filePath = path_1.default.join(multer_service_1.UPLOAD_DIR, upload.file.filename);
        await fs_1.promises.unlink(filePath).catch(() => console.warn('File already deleted or missing'));
        return res.status(200).json({ status: true, message: 'File deleted successfully' });
    }
    catch (error) {
        return (0, errorHandler_1.handleControllerError)(res, error);
    }
};
exports.uploadController = {
    renderUploadPage,
    uploadFile,
    deleteUpload
};
//# sourceMappingURL=upload.controller.js.map