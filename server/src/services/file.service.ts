import { PrismaClient, File as PrismaFile } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import {
    uploadSingle,
    uploadMultiple,
    uploadProfilePic,
    uploadAttachment,
    processImage,
    generateThumbnail,
    deleteFile as deletePhysicalFile,
    getFileUrl,
    ALLOWED_IMAGE_TYPES,
    UploadedFile,
} from '../middlewares/upload.middleware';

const prisma = new PrismaClient();

export interface FileUploadResult {
    success: boolean;
    file?: PrismaFile;
    error?: string;
}

export interface UploadOptions {
    entityType?: string;
    entityId?: string;
    projectId?: string;
    taskId?: string;
    messageId?: string;
    isProfilePic?: boolean;
    isAttachment?: boolean;
    metadata?: Record<string, any>;
}

export const STORAGE_TYPE = {
    LOCAL: 'local',
    AWS_S3: 'aws_s3',
    CLOUDINARY: 'cloudinary',
};

class FileService {
    private storageType: string = process.env.STORAGE_TYPE || STORAGE_TYPE.LOCAL;

    async uploadFile(
        file: Express.Multer.File,
        uploadedById: string,
        options: UploadOptions = {}
    ): Promise<FileUploadResult> {
        try {
            const uploadedFile = file as UploadedFile;

            const imageMetadata = await processImage(uploadedFile);
            const thumbnailUrl = await generateThumbnail(uploadedFile);

            const fileRecord = await prisma.file.create({
                data: {
                    filename: uploadedFile.filename,
                    originalName: uploadedFile.originalname,
                    mimeType: uploadedFile.mimetype,
                    size: uploadedFile.size,
                    path: uploadedFile.path,
                    url: getFileUrl(file),
                    thumbnailUrl,
                    width: imageMetadata.width,
                    height: imageMetadata.height,
                    entityType: options.entityType,
                    entityId: options.entityId,
                    uploadedById,
                    projectId: options.projectId,
                    taskId: options.taskId,
                    messageId: options.messageId,
                    isProfilePic: options.isProfilePic || false,
                    isAttachment: options.isAttachment || false,
                    storageType: this.storageType,
                    metadata: options.metadata || undefined,
                },
            });

            return { success: true, file: fileRecord };
        } catch (error) {
            console.error('Error uploading file:', error);
            return { success: false, error: 'Failed to upload file' };
        }
    }

    async uploadMultipleFiles(
        files: Express.Multer.File[],
        uploadedById: string,
        options: UploadOptions = {}
    ): Promise<FileUploadResult[]> {
        const results: FileUploadResult[] = [];
        for (const file of files) {
            const result = await this.uploadFile(file, uploadedById, options);
            results.push(result);
        }
        return results;
    }

    async uploadProfilePic(
        file: Express.Multer.File,
        userId: string
    ): Promise<FileUploadResult> {
        try {
            const existingPic = await prisma.file.findFirst({
                where: { uploadedById: userId, isProfilePic: true },
            });

            if (existingPic) {
                await this.deleteFile(existingPic.id);
            }

            const uploadedFile = file as UploadedFile;
            const imageMetadata = await processImage(uploadedFile);
            const thumbnailUrl = await generateThumbnail(uploadedFile);

            const fileRecord = await prisma.file.create({
                data: {
                    filename: uploadedFile.filename,
                    originalName: uploadedFile.originalname,
                    mimeType: uploadedFile.mimetype,
                    size: uploadedFile.size,
                    path: uploadedFile.path,
                    url: getFileUrl(file),
                    thumbnailUrl: thumbnailUrl || undefined,
                    width: imageMetadata.width,
                    height: imageMetadata.height,
                    uploadedById: userId,
                    isProfilePic: true,
                    storageType: this.storageType,
                },
            });

            await prisma.profile.update({
                where: { userId: userId },
                data: { avatarUrl: fileRecord.url },
            });

            return { success: true, file: fileRecord };
        } catch (error) {
            console.error('Error uploading profile pic:', error);
            return { success: false, error: 'Failed to upload profile picture' };
        }
    }

    async uploadAttachment(
        file: Express.Multer.File,
        uploadedById: string,
        entityType: string,
        entityId: string
    ): Promise<FileUploadResult> {
        return this.uploadFile(file, uploadedById, {
            entityType,
            entityId,
            isAttachment: true,
        });
    }

    async getFileById(id: string): Promise<PrismaFile | null> {
        return prisma.file.findUnique({
            where: { id },
        });
    }

    async getFiles(options: {
        entityType?: string;
        entityId?: string;
        uploadedById?: string;
        projectId?: string;
        taskId?: string;
        messageId?: string;
        isProfilePic?: boolean;
        isAttachment?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<PrismaFile[]> {
        const where: any = {};

        if (options.entityType) where.entityType = options.entityType;
        if (options.entityId) where.entityId = options.entityId;
        if (options.uploadedById) where.uploadedById = options.uploadedById;
        if (options.projectId) where.projectId = options.projectId;
        if (options.taskId) where.taskId = options.taskId;
        if (options.messageId) where.messageId = options.messageId;
        if (options.isProfilePic !== undefined) where.isProfilePic = options.isProfilePic;
        if (options.isAttachment !== undefined) where.isAttachment = options.isAttachment;

        return prisma.file.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: options.limit || 50,
            skip: options.offset || 0,
        });
    }

    async deleteFile(id: string): Promise<boolean> {
        try {
            const file = await prisma.file.findUnique({ where: { id } });
            if (!file) return false;

            deletePhysicalFile(file.path);

            await prisma.file.delete({ where: { id } });

            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }

    async deleteMultipleFiles(ids: string[]): Promise<boolean> {
        for (const id of ids) {
            await this.deleteFile(id);
        }
        return true;
    }

    async getFilePath(id: string): Promise<string | null> {
        const file = await prisma.file.findUnique({ where: { id } });
        return file?.path || null;
    }

    isImage(mimeType: string): boolean {
        return ALLOWED_IMAGE_TYPES.includes(mimeType);
    }

    getMimeTypeCategory(mimeType: string): string {
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.includes('word')) return 'document';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet';
        if (mimeType === 'text/plain') return 'text';
        if (mimeType === 'text/csv') return 'csv';
        return 'other';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export const fileService = new FileService();
export default fileService;
