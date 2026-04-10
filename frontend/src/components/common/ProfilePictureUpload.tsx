// @ts-nocheck
import React, { useState } from 'react';
import { FileUpload, FileList, FilePreview } from '@/components/ui/file-components';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFileUpload, useFilePreview } from '@/hooks/useFileUpload';
import { camera } from 'lucide-react';

export const ProfilePictureUpload = ({ 
    currentAvatar, 
    onUploadSuccess,
    className 
}) => {
    const { upload, uploading, progress } = useFileUpload({ type: 'profile' });
    const { previewFile, isOpen, openPreview, closePreview } = useFilePreview();
    const [localAvatar, setLocalAvatar] = useState(currentAvatar);

    const handleUpload = async (files) => {
        if (files.length === 0) return;

        try {
            const response = await upload(files[0]);
            if (response?.data?.file?.url) {
                setLocalAvatar(response.data.file.url);
                onUploadSuccess?.(response.data.file);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <>
            <div className={className}>
                <div className="relative inline-block">
                    <Avatar className="w-32 h-32">
                        <AvatarImage src={localAvatar} alt="Profile" />
                        <AvatarFallback>Profile</AvatarFallback>
                    </Avatar>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <FileUpload
                            onUpload={handleUpload}
                            accept={{
                                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
                            }}
                            maxSize={5 * 1024 * 1024}
                            maxFiles={1}
                            multiple={false}
                            showPreview={false}
                            showProgress={false}
                            disabled={uploading}
                            className="w-full h-full"
                        />
                    </div>
                </div>

                {uploading && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Uploading... {Object.values(progress)[0] || 0}%
                    </p>
                )}
            </div>

            <FilePreview
                file={{ url: localAvatar, mimeType: 'image/*' }}
                isOpen={isOpen}
                onClose={closePreview}
            />
        </>
    );
};

export default ProfilePictureUpload;
