const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ensureUploadDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = 'uploads/temp/';
        
        if (file.fieldname === 'assignmentFile') {
            uploadPath = 'uploads/assignments/';
        } else if (file.fieldname === 'submissionFile') {
            uploadPath = 'uploads/submissions/';
        } else if (file.fieldname === 'bookFile') {
            uploadPath = 'uploads/books/';
        } else if (file.fieldname === 'profilePicture') {
            uploadPath = 'uploads/profiles/';
        } else if (file.fieldname === 'newsImage') {
            uploadPath = 'uploads/news/';
        } else if (file.fieldname === 'messageAttachment') {
            uploadPath = 'uploads/messages/';
        }
        
        ensureUploadDir(uploadPath);
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname).toLowerCase();
        const fileName = `${Date.now()}-${uniqueId}${extension}`;
        
        file.originalName = file.originalname;
        file.savedName = fileName;
        file.fullPath = path.join(file.destination, fileName);
        
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = {
        'assignmentFile': [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        'submissionFile': [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        'bookFile': [
            'application/pdf',
            'application/epub+zip',
            'application/vnd.amazon.ebook',
            'application/x-mobipocket-ebook'
        ],
        'profilePicture': [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ],
        'newsImage': [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp'
        ],
        'messageAttachment': [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'application/zip',
            'application/x-rar-compressed'
        ]
    };

    const allowedExtensions = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.epub': 'application/epub+zip',
        '.mobi': 'application/x-mobipocket-ebook',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.txt': 'text/plain',
        '.zip': 'application/zip',
        '.rar': 'application/x-rar-compressed'
    };

    const maxSizes = {
        'assignmentFile': 10 * 1024 * 1024,
        'submissionFile': 10 * 1024 * 1024,
        'bookFile': 50 * 1024 * 1024,
        'profilePicture': 5 * 1024 * 1024,
        'newsImage': 5 * 1024 * 1024,
        'messageAttachment': 10 * 1024 * 1024
    };

    if (!allowedMimeTypes[file.fieldname]) {
        return cb(new Error('Invalid file field name'), false);
    }

    const allowedTypes = allowedMimeTypes[file.fieldname];
    const maxSize = maxSizes[file.fieldname] || 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowedTypes.join(', ')}`), false);
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions[extension] || allowedTypes.includes(allowedExtensions[extension])) {
        if (file.size > maxSize) {
            return cb(new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`), false);
        }
        return cb(null, true);
    }

    cb(new Error('Invalid file extension'), false);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
});

const uploadSingle = (fieldName) => {
    return (req, res, next) => {
        const uploadMiddleware = upload.single(fieldName);
        
        uploadMiddleware(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'File too large. Maximum size is 50MB'
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            if (req.file) {
                req.file.url = `/uploads/${fieldName}/${req.file.filename}`;
                req.file.originalName = req.file.originalname;
            }
            
            next();
        });
    };
};

const uploadMultiple = (fieldName, maxCount = 5) => {
    return (req, res, next) => {
        const uploadMiddleware = upload.array(fieldName, maxCount);
        
        uploadMiddleware(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: 'One or more files exceed size limit'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        message: `Maximum ${maxCount} files allowed`
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            if (req.files && req.files.length > 0) {
                req.files = req.files.map(file => {
                    file.url = `/uploads/${fieldName}/${file.filename}`;
                    file.originalName = file.originalname;
                    return file;
                });
            }
            
            next();
        });
    };
};

const uploadFields = (fields) => {
    return (req, res, next) => {
        const uploadMiddleware = upload.fields(fields);
        
        uploadMiddleware(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            } else if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }
            
            if (req.files) {
                Object.keys(req.files).forEach(fieldName => {
                    req.files[fieldName].forEach(file => {
                        file.url = `/uploads/${fieldName}/${file.filename}`;
                        file.originalName = file.originalname;
                    });
                });
            }
            
            next();
        });
    };
};

const validatePDFOnly = (req, res, next) => {
    if (req.file && req.file.mimetype !== 'application/pdf') {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
            success: false,
            message: 'Only PDF files are allowed for this upload'
        });
    }
    
    if (req.files) {
        const invalidFiles = req.files.filter(file => 
            file.mimetype !== 'application/pdf'
        );
        
        if (invalidFiles.length > 0) {
            invalidFiles.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
            
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed for this upload'
            });
        }
    }
    
    next();
};

const validateImageOnly = (req, res, next) => {
    const allowedImageTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    
    if (req.file && !allowedImageTypes.includes(req.file.mimetype)) {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed (JPEG, PNG, GIF, WebP)'
        });
    }
    
    next();
};

const validateBookFile = (req, res, next) => {
    const allowedBookTypes = [
        'application/pdf',
        'application/epub+zip',
        'application/vnd.amazon.ebook',
        'application/x-mobipocket-ebook'
    ];
    
    if (req.file && !allowedBookTypes.includes(req.file.mimetype)) {
        if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({
            success: false,
            message: 'Invalid book format. Allowed: PDF, EPUB, MOBI'
        });
    }
    
    next();
};

const cleanupUploadedFiles = (req, res, next) => {
    const cleanup = () => {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        if (req.files) {
            if (Array.isArray(req.files)) {
                req.files.forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            } else {
                Object.values(req.files).flat().forEach(file => {
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                });
            }
        }
    };

    res.on('finish', cleanup);
    res.on('close', cleanup);
    
    next();
};

const compressImage = async (filePath, maxWidth = 1200, quality = 80) => {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const extension = path.extname(filePath).toLowerCase();
    
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
        return filePath;
    }

    try {
        const sharp = require('sharp');
        const compressedPath = filePath.replace(/(\.[\w\d]+)$/, '_compressed$1');
        
        await sharp(filePath)
            .resize(maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: extension === '.jpg' || extension === '.jpeg' ? quality : undefined })
            .png({ quality: extension === '.png' ? Math.floor(quality * 0.9) : undefined })
            .webp({ quality: extension === '.webp' ? quality : undefined })
            .toFile(compressedPath);

        fs.unlinkSync(filePath);
        fs.renameSync(compressedPath, filePath);
        
        return filePath;
    } catch (error) {
        console.error('Image compression failed:', error);
        return filePath;
    }
};

const generateThumbnail = async (filePath, size = 200) => {
    if (!fs.existsSync(filePath)) {
        return null;
    }

    const extension = path.extname(filePath).toLowerCase();
    
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
        return null;
    }

    try {
        const sharp = require('sharp');
        const thumbnailPath = filePath.replace(/(\.[\w\d]+)$/, '_thumb$1');
        
        await sharp(filePath)
            .resize(size, size, {
                fit: 'cover',
                position: 'center'
            })
            .toFile(thumbnailPath);

        return thumbnailPath;
    } catch (error) {
        console.error('Thumbnail generation failed:', error);
        return null;
    }
};

const scanForMalware = async (filePath) => {
    try {
        const fs = require('fs');
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        if (!fs.existsSync(filePath)) {
            return { clean: false, reason: 'File not found' };
        }

        const fileSize = fs.statSync(filePath).size;
        if (fileSize > 100 * 1024 * 1024) {
            return { clean: true, reason: 'File too large for scanning, skipping' };
        }

        if (process.env.ENABLE_VIRUS_SCAN === 'true') {
            const { stdout, stderr } = await execPromise(`clamscan --no-summary "${filePath}"`);
            
            if (stdout.includes('OK')) {
                return { clean: true, reason: 'File scanned and clean' };
            } else {
                fs.unlinkSync(filePath);
                return { 
                    clean: false, 
                    reason: 'Malware detected', 
                    details: stdout 
                };
            }
        }

        return { clean: true, reason: 'Virus scanning disabled' };
    } catch (error) {
        console.error('Malware scan error:', error);
        return { clean: true, reason: 'Scan error, assuming clean' };
    }
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadFields,
    validatePDFOnly,
    validateImageOnly,
    validateBookFile,
    cleanupUploadedFiles,
    compressImage,
    generateThumbnail,
    scanForMalware,
    ensureUploadDir
};