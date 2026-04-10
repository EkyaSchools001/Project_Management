// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { FileUpload, FileList, FilePreview } from '@/components/ui/file-components';
import { Button } from '@/components/ui/button';
import { useFileUpload, useFileList, useFilePreview } from '@/hooks/useFileUpload';
import { fileService } from '@/services/file.service';
import { Paperclip, Plus } from 'lucide-react';

export const TaskAttachments = ({ 
    taskId, 
    className,
    showUpload = true,
}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { files, fetchFiles, deleteFile, downloadFile, loading } = useFileList({
        taskId,
    });
    const { openPreview } = useFilePreview();

    useEffect(() => {
        fetchFiles();
    }, [taskId, refreshKey]);

    const handleUpload = async (uploadedFiles) => {
        const results = [];
        for (const file of uploadedFiles) {
            try {
                const response = await fileService.uploadTaskAttachment(taskId, file);
                results.push(response);
            } catch (error) {
                console.error('Upload failed:', error);
            }
        }
        setRefreshKey((k) => k + 1);
        return results;
    };

    const handleDelete = async (fileId) => {
        await deleteFile(fileId);
        setRefreshKey((k) => k + 1);
    };

    const handleDownload = async (file) => {
        await downloadFile(file);
    };

    const handlePreview = (file) => {
        const imageFiles = files.filter((f) => f.mimeType?.startsWith('image/'));
        openPreview(file, imageFiles);
    };

    return (
        <div className={className}>
            {showUpload && (
                <div className="mb-4">
                    <FileUpload
                        onUpload={handleUpload}
                        uploadType="task"
                        maxSize={50 * 1024 * 1024}
                        maxFiles={10}
                        showPreview={true}
                        showProgress={true}
                    />
                </div>
            )}

            <FileList
                files={files}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onPreview={handlePreview}
                emptyMessage="No attachments yet"
                compact={true}
            />

            <FilePreview
                file={previewFile}
                isOpen={isOpen}
                onClose={closePreview}
            />
        </div>
    );
};

export default TaskAttachments;
