// @ts-nocheck
import React, { useState } from 'react';
import { FileUpload, FilePreview } from '@/components/ui/file-components';
import { Button } from '@/components/ui/button';
import { fileService } from '@/services/file.service';
import { Paperclip, X, Send, Image as ImageIcon, File as FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ChatAttachments = ({
    messageId,
    onUploadSuccess,
    className,
    maxFiles = 5,
    disabled = false,
}) => {
    const [attachments, setAttachments] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (files) => {
        if (files.length === 0) return;

        const remainingSlots = maxFiles - attachments.length;
        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        setUploading(true);

        try {
            const newAttachments = [];
            for (const file of filesToUpload) {
                const result = await fileService.uploadFile(file, 'chat', {
                    messageId,
                });
                newAttachments.push(result.data?.file || result);
            }

            setAttachments((prev) => [...prev, ...newAttachments]);
            onUploadSuccess?.(newAttachments);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (fileId) => {
        setAttachments((prev) => prev.filter((f) => f.id !== fileId));
    };

    const handlePreview = (file) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const isImage = (mimeType) => mimeType?.startsWith('image/');

    if (attachments.length === 0 && !uploading) {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                <FileUpload
                    onUpload={handleUpload}
                    maxSize={25 * 1024 * 1024}
                    maxFiles={maxFiles}
                    showPreview={false}
                    showProgress={true}
                    disabled={disabled}
                    className="w-auto"
                />
            </div>
        );
    }

    return (
        <>
            <div className={cn('flex flex-wrap gap-2', className)}>
                {attachments.map((file) => (
                    <div
                        key={file.id}
                        className="relative group bg-muted rounded-lg overflow-hidden"
                    >
                        {isImage(file.mimeType) ? (
                            <div
                                className="w-16 h-16 cursor-pointer"
                                onClick={() => handlePreview(file)}
                            >
                                <img
                                    src={file.thumbnailUrl || file.url}
                                    alt={file.originalName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 flex flex-col items-center justify-center p-1">
                                <FileIcon className="w-6 h-6 text-muted-foreground" />
                                <span className="text-[8px] truncate w-full text-center">
                                    {file.originalName?.split('.').pop()?.toUpperCase()}
                                </span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => handleRemove(file.id)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={disabled}
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                            <p className="text-[8px] text-foreground truncate">
                                {formatFileSize(file.size)}
                            </p>
                        </div>
                    </div>
                ))}

                {attachments.length < maxFiles && (
                    <FileUpload
                        onUpload={handleUpload}
                        maxSize={25 * 1024 * 1024}
                        maxFiles={maxFiles - attachments.length}
                        showPreview={false}
                        showProgress={true}
                        disabled={disabled || uploading}
                        className="w-auto"
                    />
                )}
            </div>

            <FilePreview
                file={previewFile}
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                onDownload={(file) => fileService.downloadFile(file.id)}
            />
        </>
    );
};

export default ChatAttachments;
