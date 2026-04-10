import api from './api.client';

const getStoredFiles = () => {
    try {
        const stored = localStorage.getItem('school_files');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveFiles = (files) => {
    localStorage.setItem('school_files', JSON.stringify(files));
};

export const fileService = {
    async uploadFile(file, type = 'document', metadata = {}) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            Object.entries(metadata).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await api.post('/files/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    return percentCompleted;
                }
            });
            return response.data;
        } catch (error) {
            const fileData = {
                id: `f-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString(),
                type,
                ...metadata
            };
            const files = getStoredFiles();
            saveFiles([...files, fileData]);
            return fileData;
        }
    },

    async uploadMultipleFiles(files, options = {}) {
        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            if (options.projectId) formData.append('projectId', options.projectId);
            if (options.taskId) formData.append('taskId', options.taskId);
            if (options.messageId) formData.append('messageId', options.messageId);
            if (options.entityType) formData.append('entityType', options.entityType);
            if (options.entityId) formData.append('entityId', options.entityId);

            const response = await api.post('/files/upload-multiple', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            const fileDataList = files.map((file) => ({
                id: `f-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                uploadedAt: new Date().toISOString(),
                ...options,
            }));
            const files = getStoredFiles();
            saveFiles([...files, ...fileDataList]);
            return { data: { files: fileDataList } };
        }
    },

    async uploadProfilePic(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post('/files/profile-pic', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            return {
                id: `pp-${Date.now()}`,
                url: URL.createObjectURL(file),
                type: 'profile'
            };
        }
    },

    async uploadTaskAttachment(taskId, file) {
        try {
            const formData = new FormData();
            formData.append('attachment', file);

            const response = await api.post(`/files/tasks/${taskId}/attachment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            const fileData = {
                id: `att-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                taskId,
                uploadedAt: new Date().toISOString(),
            };
            const files = getStoredFiles();
            saveFiles([...files, fileData]);
            return fileData;
        }
    },

    async uploadProjectAttachment(projectId, file) {
        try {
            const formData = new FormData();
            formData.append('attachment', file);

            const response = await api.post(`/files/projects/${projectId}/attachment`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            const fileData = {
                id: `att-${Date.now()}`,
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
                projectId,
                uploadedAt: new Date().toISOString(),
            };
            const files = getStoredFiles();
            saveFiles([...files, fileData]);
            return fileData;
        }
    },

    async getFiles(params = {}) {
        try {
            const response = await api.get('/files', { params });
            return {
                data: response.data.data?.files || response.data.data || response.data,
                total: response.data.total
            };
        } catch (error) {
            console.warn('API unavailable, using local storage');
            await new Promise(resolve => setTimeout(resolve, 200));
            let files = getStoredFiles();
            
            if (params.type) {
                files = files.filter(f => f.type === params.type);
            }
            
            if (params.folderId) {
                files = files.filter(f => f.folderId === params.folderId);
            }
            
            if (params.search) {
                const search = params.search.toLowerCase();
                files = files.filter(f => f.name?.toLowerCase().includes(search));
            }
            
            if (params.uploadedBy) {
                files = files.filter(f => f.uploadedBy === params.uploadedBy);
            }

            if (params.projectId) {
                files = files.filter(f => f.projectId === params.projectId);
            }

            if (params.taskId) {
                files = files.filter(f => f.taskId === params.taskId);
            }
            
            const page = params.page || 1;
            const limit = params.limit || 50;
            const start = (page - 1) * limit;
            
            return {
                data: files.slice(start, start + limit),
                total: files.length
            };
        }
    },

    async getMyFiles(limit = 50, offset = 0) {
        try {
            const response = await api.get('/files/my-files', {
                params: { limit, offset }
            });
            return response.data.data?.files || [];
        } catch (error) {
            return getStoredFiles();
        }
    },

    async downloadFile(id) {
        try {
            const response = await api.get(`/files/${id}/download`, {
                responseType: 'blob'
            });
            
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'download';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (error) {
            const file = getStoredFiles().find(f => f.id === id);
            if (file?.url) {
                const link = document.createElement('a');
                link.href = file.url;
                link.setAttribute('download', file.name);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return { success: true };
            }
            throw error;
        }
    },

    async deleteFile(id) {
        try {
            return await api.delete(`/files/${id}`);
        } catch (error) {
            console.warn('API unavailable, using local storage');
            const files = getStoredFiles();
            const filtered = files.filter(f => f.id !== id);
            saveFiles(filtered);
            return { success: true };
        }
    },

    async deleteFiles(ids) {
        try {
            return await Promise.all(ids.map((id) => api.delete(`/files/${id}`)));
        } catch (error) {
            const files = getStoredFiles();
            const filtered = files.filter(f => !ids.includes(f.id));
            saveFiles(filtered);
            return { success: true, deleted: ids.length };
        }
    },

    async getFileInfo(id) {
        try {
            const response = await api.get(`/files/${id}`);
            return response.data.data?.file || response.data;
        } catch (error) {
            return getStoredFiles().find(f => f.id === id);
        }
    },

    async updateFile(id, data) {
        try {
            return await api.patch(`/files/${id}`, data);
        } catch (error) {
            const files = getStoredFiles();
            const updated = files.map(f => f.id === id ? { ...f, ...data } : f);
            saveFiles(updated);
            return updated.find(f => f.id === id);
        }
    },

    async moveFile(id, folderId) {
        try {
            return await api.patch(`/files/${id}/move`, { folderId });
        } catch (error) {
            return this.updateFile(id, { folderId });
        }
    },

    async copyFile(id, targetFolderId) {
        try {
            return await api.post(`/files/${id}/copy`, { folderId: targetFolderId });
        } catch (error) {
            const file = getStoredFiles().find(f => f.id === id);
            const copied = {
                ...file,
                id: `f-${Date.now()}`,
                folderId: targetFolderId,
                name: `${file?.name} (copy)`,
                uploadedAt: new Date().toISOString()
            };
            const files = getStoredFiles();
            saveFiles([...files, copied]);
            return copied;
        }
    },

    async renameFile(id, newName) {
        try {
            return await api.patch(`/files/${id}/rename`, { name: newName });
        } catch (error) {
            return this.updateFile(id, { name: newName });
        }
    },

    async shareFile(id, shareData) {
        try {
            return await api.post(`/files/${id}/share`, shareData);
        } catch (error) {
            return {
                id: `share-${Date.now()}`,
                fileId: id,
                ...shareData,
                url: `${window.location.origin}/shared/${id}`,
                createdAt: new Date().toISOString()
            };
        }
    },

    async getSharedFiles(params = {}) {
        try {
            return await api.get('/files/shared', { params });
        } catch (error) {
            return [];
        }
    },

    async getFileVersions(id) {
        try {
            return await api.get(`/files/${id}/versions`);
        } catch (error) {
            return [];
        }
    },

    async restoreVersion(fileId, versionId) {
        try {
            return await api.post(`/files/${fileId}/versions/${versionId}/restore`);
        } catch (error) {
            return { success: true, versionId };
        }
    },

    async createFolder(name, parentId = null) {
        try {
            return await api.post('/files/folders', { name, parentId });
        } catch (error) {
            const folder = {
                id: `folder-${Date.now()}`,
                name,
                parentId,
                type: 'folder',
                createdAt: new Date().toISOString()
            };
            const files = getStoredFiles();
            saveFiles([...files, folder]);
            return folder;
        }
    },

    async getFolders(parentId = null) {
        try {
            const response = await api.get('/files/folders', { params: { parentId } });
            return response.data;
        } catch (error) {
            const files = getStoredFiles();
            return files.filter(f => f.type === 'folder' && f.parentId === parentId);
        }
    },

    async deleteFolder(id) {
        try {
            return await api.delete(`/files/folders/${id}`);
        } catch (error) {
            const files = getStoredFiles();
            const toDelete = [id];
            
            const findChildren = (parentId) => {
                const children = files.filter(f => f.parentId === parentId);
                children.forEach(child => {
                    toDelete.push(child.id);
                    if (child.type === 'folder') {
                        findChildren(child.id);
                    }
                });
            };
            
            findChildren(id);
            const filtered = files.filter(f => !toDelete.includes(f.id));
            saveFiles(filtered);
            return { success: true, deleted: toDelete.length };
        }
    },

    async getStorageInfo() {
        try {
            return await api.get('/files/storage');
        } catch (error) {
            return {
                used: 2.5 * 1024 * 1024 * 1024,
                total: 10 * 1024 * 1024 * 1024,
                usedFormatted: '2.5 GB',
                totalFormatted: '10 GB',
                percentage: 25
            };
        }
    },

    async getRecentFiles(limit = 10) {
        try {
            return await api.get('/files/recent', { params: { limit } });
        } catch (error) {
            const files = getStoredFiles();
            return files
                .filter(f => f.type !== 'folder')
                .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
                .slice(0, limit);
        }
    },

    async getFavorites() {
        try {
            return await api.get('/files/favorites');
        } catch (error) {
            return getStoredFiles().filter(f => f.favorite);
        }
    },

    async addToFavorites(id) {
        return this.updateFile(id, { favorite: true });
    },

    async removeFromFavorites(id) {
        return this.updateFile(id, { favorite: false });
    },

    async searchFiles(query, filters = {}) {
        try {
            return await api.get('/files/search', { 
                params: { q: query, ...filters } 
            });
        } catch (error) {
            const search = query.toLowerCase();
            let files = getStoredFiles().filter(f => 
                f.name?.toLowerCase().includes(search)
            );
            
            if (filters.type) {
                files = files.filter(f => f.type === filters.type);
            }
            
            if (filters.extension) {
                files = files.filter(f => f.name?.endsWith(`.${filters.extension}`));
            }
            
            return files;
        }
    },

    async getFileThumbnail(id) {
        try {
            const response = await api.get(`/files/${id}/thumbnail`, {
                responseType: 'blob'
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            const file = getStoredFiles().find(f => f.id === id);
            return file?.thumbnail || file?.url;
        }
    },

    async compressFile(id, options = {}) {
        try {
            return await api.post(`/files/${id}/compress`, options);
        } catch (error) {
            return { success: true, compressedId: `${id}-compressed` };
        }
    },

    async convertFile(id, targetFormat) {
        try {
            return await api.post(`/files/${id}/convert`, { format: targetFormat });
        } catch (error) {
            return { success: true, convertedId: `${id}-${targetFormat}` };
        }
    },

    getAllFiles: () => getStoredFiles(),
    saveAllFiles: saveFiles,

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    getFileIcon(mimeType) {
        if (!mimeType) return 'file';
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'video';
        if (mimeType.startsWith('audio/')) return 'audio';
        if (mimeType === 'application/pdf') return 'pdf';
        if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'spreadsheet';
        if (mimeType === 'text/plain') return 'text';
        if (mimeType === 'text/csv') return 'csv';
        return 'file';
    },
};

export default fileService;
