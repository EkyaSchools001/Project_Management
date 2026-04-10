// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Progress } from './progress';
import {
    Upload,
    X,
    File,
    Image,
    FileText,
    Film,
    Music,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    CloudUpload,
} from 'lucide-react';

const FILE_ICONS = {
    image: Image,
    video: Film,
    audio: Music,
    pdf: FileText,
    document: FileText,
    spreadsheet: FileSpreadsheet,
    text: FileText,
    csv: FileSpreadsheet,
    default: File,
};

export function getFileIcon(mimeType, className) {
    if (!mimeType) return File;
    if (mimeType.startsWith('image/')) return Image;
    if (mimeType.startsWith('video/')) return Film;
    if (mimeType.startsWith('audio/')) return Music;
    if (mimeType === 'application/pdf') return FileText;
    if (mimeType.includes('word') || mimeType.includes('document')) return FileText;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FileSpreadsheet;
    if (mimeType === 'text/plain' || mimeType === 'text/csv') return FileText;
    return File;
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function isImageFile(mimeType) {
    return mimeType?.startsWith('image/');
}

export function isPdfFile(mimeType) {
    return mimeType === 'application/pdf';
}

export function isVideoFile(mimeType) {
    return mimeType?.startsWith('video/');
}

export function isAudioFile(mimeType) {
    return mimeType?.startsWith('audio/');
}

const FileUpload = ({
    onUpload,
    onRemove,
    accept = {
        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'text/plain': ['.txt'],
        'text/csv': ['.csv'],
    },
    maxSize = 10 * 1024 * 1024,
    maxFiles = 10,
    multiple = true,
    showPreview = true,
    showProgress = true,
    disabled = false,
    className,
    uploadType,
}) => {
    const [files, setFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadStatus, setUploadStatus] = useState({});
    const [previews, setPreviews] = useState({});

    const onDrop = useCallback(
        (acceptedFiles, rejectedFiles) => {
            const newFiles = acceptedFiles.map((file) => {
                const preview = showPreview && isImageFile(file.type)
                    ? URL.createObjectURL(file)
                    : null;
                
                return {
                    id: `${file.name}-${file.size}-${Date.now()}`,
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview,
                };
            });

            setFiles((prev) => {
                const updated = multiple ? [...prev, ...newFiles] : newFiles;
                return updated.slice(0, maxFiles);
            });

            acceptedFiles.forEach((file) => {
                setPreviews((prev) => ({
                    ...prev,
                    [file.name]: showPreview && isImageFile(file.type)
                        ? URL.createObjectURL(file)
                        : null,
                }));
            });

            if (rejectedFiles.length > 0) {
                console.warn('Some files were rejected:', rejectedFiles);
            }

            if (onUpload && acceptedFiles.length > 0) {
                handleUpload(acceptedFiles);
            }
        },
        [multiple, maxFiles, onUpload, showPreview]
    );

    const handleUpload = async (filesToUpload) => {
        for (const file of filesToUpload) {
            const fileId = `${file.name}-${file.size}`;
            
            setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
            setUploadStatus((prev) => ({ ...prev, [fileId]: 'uploading' }));

            try {
                let response;
                if (uploadType === 'profile') {
                    response = await uploadProfilePicRequest(file);
                } else if (uploadType === 'task') {
                    response = await uploadTaskAttachmentRequest(file);
                } else if (uploadType === 'project') {
                    response = await uploadProjectAttachmentRequest(file);
                } else {
                    response = await uploadFileRequest(file);
                }

                setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
                setUploadStatus((prev) => ({ ...prev, [fileId]: 'success' }));

                setTimeout(() => {
                    setUploadProgress((prev) => {
                        const newProgress = { ...prev };
                        delete newProgress[fileId];
                        return newProgress;
                    });
                    setUploadStatus((prev) => {
                        const newStatus = { ...prev };
                        delete newStatus[fileId];
                        return newStatus;
                    });
                }, 2000);
            } catch (error) {
                console.error('Upload error:', error);
                setUploadStatus((prev) => ({ ...prev, [fileId]: 'error' }));
            }
        }
    };

    const uploadFileRequest = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/files/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    };

    const uploadProfilePicRequest = async (file) => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/api/files/profile-pic', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    };

    const uploadTaskAttachmentRequest = async (file, taskId) => {
        const formData = new FormData();
        formData.append('attachment', file);

        const response = await fetch(`/api/files/tasks/${taskId}/attachment`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    };

    const uploadProjectAttachmentRequest = async (file, projectId) => {
        const formData = new FormData();
        formData.append('attachment', file);

        const response = await fetch(`/api/files/projects/${projectId}/attachment`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return response.json();
    };

    const handleRemove = (fileId) => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        
        if (onRemove) {
            const file = files.find((f) => f.id === fileId);
            if (file?.preview) {
                URL.revokeObjectURL(file.preview);
            }
            onRemove(fileId);
        }
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxSize,
        maxFiles: multiple ? maxFiles : 1,
        disabled,
    });

    return (
        <div className={cn('w-full', className)}>
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
                    isDragActive && !isDragReject && 'border-primary bg-primary/5',
                    isDragReject && 'border-destructive bg-destructive/5',
                    !isDragActive && 'border-border hover:border-primary/50 hover:bg-muted/30',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                        isDragActive ? 'bg-primary/10' : 'bg-muted'
                    )}>
                        {isDragActive ? (
                            <CloudUpload className="w-8 h-8 text-primary" />
                        ) : (
                            <Upload className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            {isDragActive
                                ? 'Drop files here'
                                : 'Drag & drop files here, or click to select'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Max file size: {formatFileSize(maxSize)}
                            {multiple && ` • Max ${maxFiles} files`}
                        </p>
                    </div>

                    <Button type="button" variant="outline" size="sm" disabled={disabled}>
                        Browse Files
                    </Button>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-4 space-y-3">
                    {files.map((file) => {
                        const Icon = getFileIcon(file.type);
                        const status = uploadStatus[`${file.name}-${file.size}`];
                        const progress = uploadProgress[`${file.name}-${file.size}`];
                        const preview = previews[file.name];

                        return (
                            <div
                                key={file.id}
                                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt={file.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                    </p>

                                    {showProgress && status === 'uploading' && (
                                        <Progress value={progress || 0} className="mt-2 h-1" />
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {status === 'success' && (
                                        <CheckCircle2 className="w-5 h-5 text-success" />
                                    )}
                                    {status === 'error' && (
                                        <AlertCircle className="w-5 h-5 text-destructive" />
                                    )}
                                    
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon-sm"
                                        onClick={() => handleRemove(file.id)}
                                        disabled={status === 'uploading'}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export { FileUpload };
