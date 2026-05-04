import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3Client, { BUCKET_NAME } from '../../infrastructure/config/s3';
import { AppError } from '../../infrastructure/utils/AppError';

// ─── Determine storage mode ───────────────────────────────────────────────────
const useS3 =
    !!process.env.AWS_ACCESS_KEY_ID &&
    !!process.env.AWS_SECRET_ACCESS_KEY &&
    !!process.env.AWS_S3_BUCKET;

// ─── File filter ─────────────────────────────────────────────────────────────
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type! Only PDF, DOC, DOCX, and image files are allowed.', 400) as any, false);
    }
};

// ─── S3 storage (production) ──────────────────────────────────────────────────
let upload: multer.Multer;

if (useS3) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const multerS3 = require('multer-s3');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const s3Client = require('../../infrastructure/config/s3').default;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BUCKET_NAME } = require('../../infrastructure/config/s3');

    const s3Storage = multerS3({
        s3: s3Client,
        bucket: BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req: Request, file: Express.Multer.File, cb: Function) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req: Request, file: Express.Multer.File, cb: Function) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, 'pdi-uploads/' + uniqueSuffix + path.extname(file.originalname));
        },
    });

    upload = multer({ storage: s3Storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });
    console.log('[Upload] Using S3 storage');
} else {
    // ─── Local disk storage (development fallback) ────────────────────────────
    const uploadDir = path.join(__dirname, '../../../public/uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const diskStorage = multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, uploadDir),
        filename: (_req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    });

    upload = multer({ storage: diskStorage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });
    console.log('[Upload] Using local disk storage (no AWS credentials found)');
}

export const uploadMiddleware = upload.single('file');

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }

    // S3 puts the URL in `location`; disk storage uses `filename`
    const fileUrl = useS3
        ? (req.file as any).location
        : `/uploads/${(req.file as any).filename}`;

    res.status(201).json({
        status: 'success',
        data: {
            fileName: req.file.originalname,
            fileUrl,
            fileSize: req.file.size,
            mimetype: req.file.mimetype,
        },
    });
};
