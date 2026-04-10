// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { FileUpload, FileList, FilePreview } from '@/components/ui/file-components';
import { Button } from '@/components/ui/button';
import { useFileList, useFilePreview } from '@/hooks/useFileUpload';
import { fileService } from '@/services/file.service';
import { FolderArchive, Plus } from 'lucide-react';

export const ProjectAttachments = ({
    projectId,
    className,
    showUpload = true,
}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const { files, fetchFiles, deleteFile, downloadFile, loading } = useFileList({
        projectId,
    });
    const { previewFile, isOpen, openPreview, closePreview } = useFilePreview();

    useEffect(() => {
        fetchFiles();
    }, [projectId, refreshKey]);

    const handleUpload = async (uploadedFiles) => {
        const results = [];
        for (const file of uploadedFiles) {
            try {
                const response = await fileService.uploadProjectAttachment(projectId, file);
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
                        uploadType="project"
                        maxSize={50 * 1024 * 1024}
                        maxFiles={20}
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
                emptyMessage="No project files yet"
            />

            <FilePreview
                file={previewFile}
                isOpen={isOpen}
                onClose={closePreview}
            />
        </div>
    );
};

export default ProjectAttachments;
