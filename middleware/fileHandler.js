const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the multer storage and upload instances
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check if the 'public/images' directory exists, create it if not
        const uploadDir = 'public/images';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Check if file has a valid extension
        const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (!validExtensions.includes(ext)) {
            const error = new Error("Invalid file extension. Valid extensions are: " + validExtensions.join(', '));
            error.code = 'FILE_EXTENSION_ERROR';
            return cb(error);
        }
        // Generate a unique filename
        cb(null, Date.now() + "--" + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('logo');

// Middleware function to handle logo upload
const handleLogo = (req, res, next) => {
    // Call multer upload function
    upload(req, res, function (err) {
        if (err) {
            // If multer upload encounters an error, pass it to the error handler middleware
            return next(err);
        } else {
            // If upload is successful, move to the next middleware or route handler
            if (req.file) {
                // If file uploaded successfully, update req.body.logo path to reflect the correct location
                req.body.logo = path.join('public/images', req.file.filename);
            }
            next();
        }
    });
};

module.exports = handleLogo;
