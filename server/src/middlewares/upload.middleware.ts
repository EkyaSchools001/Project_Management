import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760');
const MAX_DOCUMENT_SIZE = parseInt(process.env.MAX_DOCUMENT_SIZE || '52428800');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
];

export const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

export interface UploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    width?: number;
    height?: number;
}

export const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
    }
};

export const getFileSizeLimit = (mimeType: string): number => {
    if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return MAX_FILE_SIZE;
    }
    return MAX_DOCUMENT_SIZE;
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_DOCUMENT_SIZE,
    },
});

export const uploadSingle = upload.single('file');

export const uploadMultiple = upload.array('files', 10);

export const uploadProfilePic = upload.single('avatar');

export const uploadAttachment = upload.single('attachment');

export const processImage = async (file: UploadedFile): Promise<Partial<UploadedFile>> => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return {};
    }

    try {
        const metadata = await sharp(file.path).metadata();
        const result: Partial<UploadedFile> = {
            width: metadata.width,
            height: metadata.height,
        };

        if (metadata.width && metadata.width > 1920) {
            const processedPath = file.path.replace(path.extname(file.path), '_compressed.jpg');
            await sharp(file.path)
                .resize(1920, null, { withoutEnlargement: true })
                .jpeg({ quality: 80 })
                .toFile(processedPath);
            
            fs.unlinkSync(file.path);
            fs.renameSync(processedPath, file.path);
        }

        return result;
    } catch (error) {
        console.error('Error processing image:', error);
        return {};
    }
};

export const generateThumbnail = async (file: UploadedFile): Promise<string | null> => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        return null;
    }

    try {
        const thumbnailDir = path.join(UPLOAD_DIR, 'thumbnails');
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true });
        }

        const thumbnailName = `thumb_${file.filename}`;
        const thumbnailPath = path.join(thumbnailDir, thumbnailName);

        await sharp(file.path)
            .resize(200, 200, { fit: 'cover' })
            .jpeg({ quality: 70 })
            .toFile(thumbnailPath);

        return `/uploads/thumbnails/${thumbnailName}`;
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        return null;
    }
};

export const deleteFile = (filePath: string): boolean => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const thumbnailPath = filePath.replace(path.basename(filePath), `thumb_${path.basename(filePath)}`);
        if (ALLOWED_IMAGE_TYPES.some(type => thumbnailPath.includes(type.split('/')[1]))) {
            const fullThumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', `thumb_${path.basename(filePath)}`);
            if (fs.existsSync(fullThumbnailPath)) {
                fs.unlinkSync(fullThumbnailPath);
            }
        }

        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

export const getFileUrl = (file: Express.Multer.File): string => {
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${file.path.replace(/\\/g, '/')}`;
};

export const getPublicUrl = (relativePath: string): string => {
    const baseUrl = process.env.CDN_URL || process.env.API_BASE_URL || 'http://localhost:3001';
    return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
};
