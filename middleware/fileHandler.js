const multer = require('multer');
const path = require('path');

// Define the multer storage and upload instances
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public');
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
                // If file uploaded successfully, attach file path to req.body.logo
                req.body.logo = req.file.path;
            }
            next();
        }
    });
};

module.exports = handleLogo;
