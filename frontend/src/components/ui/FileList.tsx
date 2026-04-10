// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import {
    File,
    Image,
    FileText,
    Film,
    Music,
    FileSpreadsheet,
    Download,
    Trash2,
    Eye,
    MoreHorizontal,
    ExternalLink,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './dropdown-menu';

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

export function getFileIcon(mimeType) {
    if (!mimeType) return FILE_ICONS.default;
    if (mimeType.startsWith('image/')) return FILE_ICONS.image;
    if (mimeType.startsWith('video/')) return FILE_ICONS.video;
    if (mimeType.startsWith('audio/')) return FILE_ICONS.audio;
    if (mimeType === 'application/pdf') return FILE_ICONS.pdf;
    if (mimeType.includes('word') || mimeType.includes('document')) return FILE_ICONS.document;
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return FILE_ICONS.spreadsheet;
    if (mimeType === 'text/plain' || mimeType === 'text/csv') return FILE_ICONS.text;
    return FILE_ICONS.default;
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export function isImageFile(mimeType) {
    return mimeType?.startsWith('image/');
}

const FileListItem = ({
    file,
    onDownload,
    onDelete,
    onPreview,
    selected,
    onSelect,
    showCheckbox = false,
    compact = false,
}) => {
    const Icon = getFileIcon(file.mimeType);

    return (
        <div
            className={cn(
                'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                'hover:bg-muted/50 hover:border-primary/30',
                selected && 'bg-primary/5 border-primary',
                compact && 'p-2'
            )}
        >
            {showCheckbox && (
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect?.(file.id)}
                    className="w-4 h-4 rounded border-border"
                />
            )}

            {isImageFile(file.mimeType) && file.thumbnailUrl ? (
                <img
                    src={file.thumbnailUrl}
                    alt={file.originalName}
                    className={cn(
                        'rounded object-cover bg-muted',
                        compact ? 'w-8 h-8' : 'w-12 h-12'
                    )}
                />
            ) : isImageFile(file.mimeType) && file.url ? (
                <img
                    src={file.url}
                    alt={file.originalName}
                    className={cn(
                        'rounded object-cover bg-muted',
                        compact ? 'w-8 h-8' : 'w-12 h-12'
                    )}
                />
            ) : (
                <div
                    className={cn(
                        'rounded bg-muted flex items-center justify-center',
                        compact ? 'w-8 h-8' : 'w-12 h-12'
                    )}
                >
                    <Icon className={cn(
                        'text-muted-foreground',
                        compact ? 'w-4 h-4' : 'w-6 h-6'
                    )} />
                </div>
            )}

            <div className="flex-1 min-w-0">
                <p className={cn(
                    'font-medium truncate',
                    compact ? 'text-sm' : 'text-base'
                )}>
                    {file.originalName || file.name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    {file.createdAt && (
                        <>
                            <span>•</span>
                            <span>{formatDate(file.createdAt)}</span>
                        </>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                {onPreview && isImageFile(file.mimeType) && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onPreview(file)}
                        title="Preview"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                )}

                {onDownload && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDownload(file)}
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                )}

                {onDelete && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(file.id)}
                        title="Delete"
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onDownload?.(file)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </DropdownMenuItem>
                        {file.url && (
                            <DropdownMenuItem asChild>
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Open in new tab
                                </a>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete?.(file.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

const FileList = ({
    files = [],
    onDownload,
    onDelete,
    onPreview,
    onSelect,
    selectedIds = [],
    showCheckbox = false,
    showEmpty = true,
    emptyMessage = 'No files uploaded yet',
    compact = false,
    className,
}) => {
    if (files.length === 0 && showEmpty) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <File className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={cn('space-y-2', className)}>
            {files.map((file) => (
                <FileListItem
                    key={file.id}
                    file={file}
                    onDownload={onDownload}
                    onDelete={onDelete}
                    onPreview={onPreview}
                    onSelect={onSelect}
                    selected={selectedIds.includes(file.id)}
                    showCheckbox={showCheckbox}
                    compact={compact}
                />
            ))}
        </div>
    );
};

export { FileList, FileListItem };
