// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from './dialog';
import {
    X,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    ChevronLeft,
    ChevronRight,
    File,
    FileText,
    Loader2,
} from 'lucide-react';

const FilePreview = ({
    file,
    isOpen,
    onClose,
    onDownload,
    showNavigation = false,
    files = [],
    onNavigate,
}) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setRotation(0);
            setLoading(true);
        }
    }, [isOpen, file?.id]);

    if (!file) return null;

    const isImage = file.mimeType?.startsWith('image/');
    const isPdf = file.mimeType === 'application/pdf';
    const isVideo = file.mimeType?.startsWith('video/');
    const isAudio = file.mimeType?.startsWith('audio/');

    const currentIndex = files.findIndex((f) => f.id === file.id);
    const hasPrevious = showNavigation && currentIndex > 0;
    const hasNext = showNavigation && currentIndex < files.length - 1;

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
    const handleReset = () => {
        setZoom(1);
        setRotation(0);
    };

    const handlePrevious = () => {
        if (hasPrevious && onNavigate) {
            onNavigate(files[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (hasNext && onNavigate) {
            onNavigate(files[currentIndex + 1]);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            
            if (e.key === 'ArrowLeft' && hasPrevious) {
                handlePrevious();
            } else if (e.key === 'ArrowRight' && hasNext) {
                handleNext();
            } else if (e.key === '+' || e.key === '=') {
                handleZoomIn();
            } else if (e.key === '-') {
                handleZoomOut();
            } else if (e.key === 'r' || e.key === 'R') {
                handleRotate();
            } else if (e.key === '0') {
                handleReset();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, hasPrevious, hasNext]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b shrink-0">
                    <DialogTitle className="truncate flex-1 mr-4">
                        {file.originalName || file.name}
                    </DialogTitle>
                    
                    <div className="flex items-center gap-1 shrink-0">
                        {isImage && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleZoomOut}
                                    title="Zoom out (-)"
                                >
                                    <ZoomOut className="w-4 h-4" />
                                </Button>
                                <span className="text-sm text-muted-foreground w-12 text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleZoomIn}
                                    title="Zoom in (+)"
                                >
                                    <ZoomIn className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleRotate}
                                    title="Rotate (R)"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </Button>
                            </>
                        )}
                        
                        {onDownload && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => onDownload(file)}
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                        
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-hidden relative bg-black/5 dark:bg-white/5">
                    {showNavigation && (
                        <>
                            {hasPrevious && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                                    onClick={handlePrevious}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                            )}
                            {hasNext && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
                                    onClick={handleNext}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            )}
                        </>
                    )}

                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    )}

                    {isImage && (
                        <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
                            <img
                                src={file.url || file.thumbnailUrl}
                                alt={file.originalName}
                                className="max-w-full max-h-full object-contain transition-transform duration-200"
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                }}
                                onLoad={() => setLoading(false)}
                            />
                        </div>
                    )}

                    {isPdf && (
                        <iframe
                            src={`${file.url}#toolbar=0`}
                            className="w-full h-full border-0"
                            title={file.originalName}
                            onLoad={() => setLoading(false)}
                        />
                    )}

                    {isVideo && (
                        <video
                            src={file.url}
                            controls
                            autoPlay
                            className="max-w-full max-h-full mx-auto"
                            onLoadedData={() => setLoading(false)}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}

                    {isAudio && (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                <FileText className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <audio
                                src={file.url}
                                controls
                                autoPlay
                                className="w-full max-w-md"
                            >
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}

                    {!isImage && !isPdf && !isVideo && !isAudio && (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                                <File className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">
                                Preview not available for this file type
                            </p>
                            {onDownload && (
                                <Button onClick={() => onDownload(file)}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download to view
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {showNavigation && files.length > 1 && (
                    <div className="px-6 py-3 border-t text-center text-sm text-muted-foreground shrink-0">
                        {currentIndex + 1} of {files.length} files
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export { FilePreview };
