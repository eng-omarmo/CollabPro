const fs = require('fs-extra');
const path = require('path');

// Function to handle logo file operations
const handleLogo = async (logo) => {
    // Check if logo is provided as a file path
    if (typeof logo !== 'string') {
        throw new Error("Logo must be provided as a file path string");
    }

    // Validate logo file path format
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const logoExt = path.extname(logo).toLowerCase();
    if (!validExtensions.includes(logoExt)) {
        throw new Error("Logo must have a valid file extension (.jpg, .jpeg, .png)");
    }

    // Move the logo file to the public folder
    const logoName = path.basename(logo);
    const logoPath = path.join('public', logoName);

    try {
        // Ensure the public directory exists, creating it if necessary
        await fs.ensureDir('public');

        // Copy the logo file to the public folder
        await fs.copyFile(logo, logoPath);

        // Delete the original logo file
        await fs.unlink(logo);

        // Return the path where the logo is saved
        return logoPath;
    } catch (error) {
        // Handle any errors that occur during file operations
        throw new Error("Failed to process logo file: " + error.message);
    }
};



module.exports = { handleLogo }