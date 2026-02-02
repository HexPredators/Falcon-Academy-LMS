const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = async (filePath, folder = 'falcon_academy', resourceType = 'auto') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: resourceType,
            use_filename: true,
            unique_filename: true,
            overwrite: false
        });
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
            success: result.result === 'ok',
            result: result
        };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const uploadPDF = async (filePath, fileName) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'falcon_academy/pdfs',
            resource_type: 'raw',
            public_id: fileName.replace(/\.[^/.]+$/, ""),
            format: 'pdf',
            type: 'authenticated'
        });
        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        console.error('PDF upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const getSignedURL = (publicId, options = {}) => {
    const url = cloudinary.url(publicId, {
        secure: true,
        sign_url: true,
        ...options
    });
    return url;
};

module.exports = {
    cloudinary,
    uploadFile,
    deleteFile,
    uploadPDF,
    getSignedURL
};