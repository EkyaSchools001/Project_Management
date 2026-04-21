import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileService } from '../services/file.service';
import { uploadSingle, uploadMultiple, uploadProfilePic, uploadAttachment } from '../middlewares/upload.middleware';
import { AuthRequest } from '../middlewares/auth';

const handleUpload = (req: AuthRequest, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(200).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: { file: req.file },
    });
};

const handleMultipleUpload = (req: AuthRequest, res: Response) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    res.status(200).json({
        status: 'success',
        message: `${req.files.length} files uploaded successfully`,
        data: { files: req.files },
    });
};

export const uploadFile = async (req: AuthRequest, res: Response) => {
    try {
        uploadSingle(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { projectId, taskId, messageId, entityType, entityId } = req.body;
            const result = await fileService.uploadFile(req.file, req.user.id, {
                projectId,
                taskId,
                messageId,
                entityType,
                entityId,
            });

            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }

            res.status(201).json({
                status: 'success',
                message: 'File uploaded successfully',
                data: { file: result.file },
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
};

export const uploadFiles = async (req: AuthRequest, res: Response) => {
    try {
        uploadMultiple(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                return res.status(400).json({ error: 'No files uploaded' });
            }

            const { projectId, taskId, messageId, entityType, entityId } = req.body;
            const results = await fileService.uploadMultipleFiles(req.files, req.user.id, {
                projectId,
                taskId,
                messageId,
                entityType,
                entityId,
            });

            const successful = results.filter((r) => r.success);
            const failed = results.filter((r) => !r.success);

            res.status(201).json({
                status: 'success',
                message: `${successful.length} files uploaded successfully`,
                data: {
                    files: successful.map((r) => r.file),
                    failedCount: failed.length,
                    errors: failed.map((r) => r.error),
                },
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
};

export const uploadProfilePicture = async (req: AuthRequest, res: Response) => {
    try {
        uploadProfilePic(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const result = await fileService.uploadProfilePic(req.file, req.user.id);

            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }

            res.status(201).json({
                status: 'success',
                message: 'Profile picture uploaded successfully',
                data: { file: result.file },
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
};

export const uploadTaskAttachment = async (req: AuthRequest, res: Response) => {
    try {
        uploadAttachment(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { taskId } = req.params;
            if (!taskId) {
                return res.status(400).json({ error: 'Task ID is required' });
            }

            const result = await fileService.uploadAttachment(req.file, req.user.id, 'task', taskId as string);

            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }

            res.status(201).json({
                status: 'success',
                message: 'Attachment uploaded successfully',
                data: { file: result.file },
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload attachment' });
    }
};

export const uploadProjectAttachment = async (req: AuthRequest, res: Response) => {
    try {
        uploadAttachment(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const { projectId } = req.params;
            if (!projectId) {
                return res.status(400).json({ error: 'Project ID is required' });
            }

            const result = await fileService.uploadAttachment(req.file, req.user.id, 'project', projectId as string);

            if (!result.success) {
                return res.status(500).json({ error: result.error });
            }

            res.status(201).json({
                status: 'success',
                message: 'Attachment uploaded successfully',
                data: { file: result.file },
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload attachment' });
    }
};

export const listFiles = async (req: AuthRequest, res: Response) => {
    try {
        const {
            entityType,
            entityId,
            projectId,
            taskId,
            messageId,
            isProfilePic,
            isAttachment,
            limit,
            offset,
        } = req.query;

        const files = await fileService.getFiles({
            entityType: entityType as string,
            entityId: entityId as string,
            projectId: projectId as string,
            taskId: taskId as string,
            messageId: messageId as string,
            isProfilePic: isProfilePic === 'true',
            isAttachment: isAttachment === 'true',
            limit: limit ? parseInt(limit as string) : 50,
            offset: offset ? parseInt(offset as string) : 0,
        });

        res.status(200).json({
            status: 'success',
            data: { files },
        });
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ error: 'Failed to list files' });
    }
};

export const getFile = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.i as string;
        const file = await fileService.getFileById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { file },
        });
    } catch (error) {
        console.error('Get file error:', error);
        res.status(500).json({ error: 'Failed to get file' });
    }
};

export const downloadFile = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.i as string;
        const file = await fileService.getFileById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        if (!fs.existsSync(file.path)) {
            return res.status(404).json({ error: 'File not found on disk' });
        }

        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.setHeader('Content-Type', file.mimeType);

        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(res);
    } catch (error) {
        console.error('Download file error:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.params.i as string;
        const file = await fileService.getFileById(id);

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const deleted = await fileService.deleteFile(id);

        if (!deleted) {
            return res.status(500).json({ error: 'Failed to delete file' });
        }

        res.status(200).json({
            status: 'success',
            message: 'File deleted successfully',
        });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
};

export const getMyFiles = async (req: AuthRequest, res: Response) => {
    try {
        const { limit, offset } = req.query;

        const files = await fileService.getFiles({
            uploadedById: req.user.id,
            limit: limit ? parseInt(limit as string) : 50,
            offset: offset ? parseInt(offset as string) : 0,
        });

        res.status(200).json({
            status: 'success',
            data: { files },
        });
    } catch (error) {
        console.error('Get my files error:', error);
        res.status(500).json({ error: 'Failed to get files' });
    }
};
