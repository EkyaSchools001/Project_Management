import { useState, useCallback } from 'react';
import { fileService } from '@/services/file.service';

export const useFileUpload = (options = {}) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState({});
    const [error, setError] = useState(null);

    const upload = useCallback(async (file) => {
        setUploading(true);
        setError(null);

        const fileId = `${file.name}-${file.size}`;
        setProgress((prev) => ({ ...prev, [fileId]: 0 }));

        try {
            let response;
            if (options.type === 'profile') {
                response = await fileService.uploadProfilePic(file);
            } else if (options.type === 'task' && options.taskId) {
                response = await fileService.uploadTaskAttachment(options.taskId, file);
            } else if (options.type === 'project' && options.projectId) {
                response = await fileService.uploadProjectAttachment(options.projectId, file);
            } else {
                response = await fileService.uploadFile(file, 'document', options.metadata);
            }

            setProgress((prev) => ({ ...prev, [fileId]: 100 }));
            setFiles((prev) => [...prev, response.data?.file || response]);

            return response;
        } catch (err) {
            setError(err.message || 'Upload failed');
            throw err;
        } finally {
            setUploading(false);
            setTimeout(() => {
                setProgress((prev) => {
                    const newProgress = { ...prev };
                    delete newProgress[fileId];
                    return newProgress;
                });
            }, 2000);
        }
    }, [options]);

    const uploadMultiple = useCallback(async (fileList) => {
        setUploading(true);
        setError(null);

        try {
            let response;
            const filesToUpload = Array.from(fileList);

            filesToUpload.forEach((file) => {
                const fileId = `${file.name}-${file.size}`;
                setProgress((prev) => ({ ...prev, [fileId]: 0 }));
            });

            if (options.type === 'task' && options.taskId) {
                response = await Promise.all(
                    filesToUpload.map((file) => 
                        fileService.uploadTaskAttachment(options.taskId, file)
                    )
                );
            } else if (options.type === 'project' && options.projectId) {
                response = await Promise.all(
                    filesToUpload.map((file) => 
                        fileService.uploadProjectAttachment(options.projectId, file)
                    )
                );
            } else {
                response = await fileService.uploadMultipleFiles(filesToUpload, {
                    projectId: options.projectId,
                    taskId: options.taskId,
                    entityType: options.entityType,
                    entityId: options.entityId,
                });
            }

            const uploadedFiles = Array.isArray(response) 
                ? response.map((r) => r.data?.file || r)
                : (response.data?.files || []);

            setFiles((prev) => [...prev, ...uploadedFiles]);

            filesToUpload.forEach((file) => {
                const fileId = `${file.name}-${file.size}`;
                setProgress((prev) => ({ ...prev, [fileId]: 100 }));
            });

            return response;
        } catch (err) {
            setError(err.message || 'Upload failed');
            throw err;
        } finally {
            setUploading(false);
            setTimeout(() => {
                setProgress({});
            }, 2000);
        }
    }, [options]);

    const remove = useCallback((fileId) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    }, []);

    const clear = useCallback(() => {
        setFiles([]);
        setProgress({});
        setError(null);
    }, []);

    return {
        files,
        uploading,
        progress,
        error,
        upload,
        uploadMultiple,
        remove,
        clear,
        setFiles,
    };
};

export const useFileList = (options = {}) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fileService.getFiles(options);
            setFiles(result.data || result);
            return result;
        } catch (err) {
            setError(err.message || 'Failed to fetch files');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [options]);

    const deleteFile = useCallback(async (fileId) => {
        try {
            await fileService.deleteFile(fileId);
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
        } catch (err) {
            setError(err.message || 'Failed to delete file');
            throw err;
        }
    }, []);

    const downloadFile = useCallback(async (file) => {
        try {
            await fileService.downloadFile(file.id);
        } catch (err) {
            setError(err.message || 'Failed to download file');
            throw err;
        }
    }, []);

    return {
        files,
        loading,
        error,
        fetchFiles,
        deleteFile,
        downloadFile,
        setFiles,
    };
};

export const useFilePreview = () => {
    const [previewFile, setPreviewFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState([]);

    const openPreview = useCallback((file, allFiles = []) => {
        setPreviewFile(file);
        setFiles(allFiles);
        setIsOpen(true);
    }, []);

    const closePreview = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setPreviewFile(null), 200);
    }, []);

    const navigateTo = useCallback((file) => {
        setPreviewFile(file);
    }, []);

    return {
        previewFile,
        isOpen,
        files,
        openPreview,
        closePreview,
        navigateTo,
        setFiles,
    };
};
