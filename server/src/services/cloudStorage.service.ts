export const STORAGE_TYPE = {
    LOCAL: 'local',
    AWS_S3: 'aws_s3',
    CLOUDINARY: 'cloudinary',
};

export const getStorageConfig = () => {
    return {
        type: process.env.STORAGE_TYPE || STORAGE_TYPE.LOCAL,
        local: {
            uploadDir: process.env.UPLOAD_DIR || './uploads',
            baseUrl: process.env.API_BASE_URL 
                ? `${process.env.API_BASE_URL}/uploads`
                : 'http://localhost:3001/uploads',
        },
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'us-east-1',
            bucket: process.env.AWS_S3_BUCKET,
            cdnUrl: process.env.AWS_CDN_URL,
        },
        cloudinary: {
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET,
            folder: process.env.CLOUDINARY_FOLDER || 'schoolos',
        },
    };
};

export const isCloudStorage = () => {
    const config = getStorageConfig();
    return config.type !== STORAGE_TYPE.LOCAL;
};

export const getUploadUrl = () => {
    const config = getStorageConfig();
    switch (config.type) {
        case STORAGE_TYPE.AWS_S3:
            return `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com`;
        case STORAGE_TYPE.CLOUDINARY:
            return `https://res.cloudinary.com/${config.cloudinary.cloudName}/raw/upload`;
        default:
            return config.local.baseUrl;
    }
};

export const getFilePublicUrl = (key) => {
    const config = getStorageConfig();
    switch (config.type) {
        case STORAGE_TYPE.AWS_S3:
            return config.aws.cdnUrl
                ? `${config.aws.cdnUrl}/${key}`
                : `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
        case STORAGE_TYPE.CLOUDINARY:
            return `https://res.cloudinary.com/${config.cloudinary.cloudName}/image/upload/${key}`;
        default:
            return `${config.local.baseUrl}/${key}`;
    }
};

export class CloudStorageService {
    constructor() {
        this.config = getStorageConfig();
    }

    async uploadToS3(file, key, options = {}) {
        if (this.config.type !== STORAGE_TYPE.AWS_S3) {
            throw new Error('S3 storage not configured');
        }

        const AWS = await import('aws-sdk');
        
        AWS.config.update({
            accessKeyId: this.config.aws.accessKeyId,
            secretAccessKey: this.config.aws.secretAccessKey,
            region: this.config.aws.region,
        });

        const s3 = new AWS.S3();
        
        const params = {
            Bucket: this.config.aws.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: options.public ? 'public-read' : 'private',
            ...options.metadata && { Metadata: options.metadata },
        };

        const result = await s3.upload(params).promise();
        
        return {
            key,
            url: result.Location,
            etag: result.ETag,
        };
    }

    async deleteFromS3(key) {
        if (this.config.type !== STORAGE_TYPE.AWS_S3) {
            throw new Error('S3 storage not configured');
        }

        const AWS = await import('aws-sdk');
        
        AWS.config.update({
            accessKeyId: this.config.aws.accessKeyId,
            secretAccessKey: this.config.aws.secretAccessKey,
            region: this.config.aws.region,
        });

        const s3 = new AWS.S3();

        await s3.deleteObject({
            Bucket: this.config.aws.bucket,
            Key: key,
        }).promise();

        return true;
    }

    async uploadToCloudinary(file, options = {}) {
        if (this.config.type !== STORAGE_TYPE.CLOUDINARY) {
            throw new Error('Cloudinary storage not configured');
        }

        const cloudinary = await import('cloudinary').then(m => m.v2);
        
        cloudinary.config({
            cloud_name: this.config.cloudinary.cloudName,
            api_key: this.config.cloudinary.apiKey,
            api_secret: this.config.cloudinary.apiSecret,
        });

        const folder = options.folder || this.config.cloudinary.folder;
        
        const result = await cloudinary.uploader.upload(file.path, {
            folder,
            resource_type: options.resourceType || 'auto',
            public_id: options.publicId,
            transformation: options.transformation,
        });

        return {
            publicId: result.public_id,
            url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
        };
    }

    async deleteFromCloudinary(publicId, resourceType = 'image') {
        if (this.config.type !== STORAGE_TYPE.CLOUDINARY) {
            throw new Error('Cloudinary storage not configured');
        }

        const cloudinary = await import('cloudinary').then(m => m.v2);
        
        cloudinary.config({
            cloud_name: this.config.cloudinary.cloudName,
            api_key: this.config.cloudinary.apiKey,
            api_secret: this.config.cloudinary.apiSecret,
        });

        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        return true;
    }

    async upload(file, key, options = {}) {
        switch (this.config.type) {
            case STORAGE_TYPE.AWS_S3:
                return this.uploadToS3(file, key, options);
            case STORAGE_TYPE.CLOUDINARY:
                return this.uploadToCloudinary(file, {
                    ...options,
                    publicId: key,
                });
            default:
                throw new Error('No cloud storage configured');
        }
    }

    async delete(key, options = {}) {
        switch (this.config.type) {
            case STORAGE_TYPE.AWS_S3:
                return this.deleteFromS3(key);
            case STORAGE_TYPE.CLOUDINARY:
                return this.deleteFromCloudinary(key, options.resourceType);
            default:
                throw new Error('No cloud storage configured');
        }
    }

    getPublicUrl(key) {
        return getFilePublicUrl(key);
    }
}

export const cloudStorageService = new CloudStorageService();
export default cloudStorageService;
