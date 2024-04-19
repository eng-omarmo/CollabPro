const { hash } = require("bcrypt");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendEmail = require("../utility/mailer");

const { handleLogo } = require("../utility/fileHandler");


//controllers

const getOrg = async (req, res) => {
    try {
        const getOrganization = await Organization.find();
        if (!getOrganization) {
            res.status(404).json({ message: "organization not found" });
        }
        res.status(200).json({ message: getOrganization });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getOrgById = async (req, res) => {
    try {
        const orgId = req.params.id.trim();

        // Validate if the provided organization ID is a valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(404).json({ message: "Invalid organization ID" });
        }

        //get the user id from the auth middleware
        const AuthOrgId = req.user.orgId
        const is_admin = req.user.is_admin

        //check if the  user in the params and auth middleware are the same in order to access the data
        if (!is_admin && AuthOrgId.toString() !== orgId) {
            return res
                .status(401)
                .json({ message: "Unauthorized to access this organization" });
        }

        // Find the organization by ID
        const organization = await Organization.findById(orgId);
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Send the organization data if found and user is eligible
        res.status(200).json({ message: "Organization found", organization });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};

const createOrg = async (req, res) => {
    try {
        const { name, address, type, contact, industry, website, password, logo } = req.body;

        // Validate required fields
        if (!name || !address || !type || !contact || !industry || !website || !password || !logo) {
            return res.status(400).json({ message: "All fields are required, including password and logo" });
        }

        // Handle logo file operations
        // Ensure the logo file is provided as a file path string
        if (typeof logo !== 'string') {
            return res.status(400).json({ message: "Logo must be provided as a file path string" });
        }
        const logoPath = await handleLogo(logo);


        // Check if user with the provided email already exists
        const existingUser = await User.findOne({ email: contact.email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Check if organization with the provided name and contact already exists
        const existingOrg = await Organization.findOne({ name, 'contact.email': contact.email });
        if (existingOrg) {
            return res.status(400).json({ message: "Organization with this name and contact already exists" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = generateRandomToken(20);

        // Create the organization
        const createdOrg = await Organization.create({
            name,
            type,
            address,
            contact,
            industry,
            website,
            is_admin: true,
            logo: logoPath,
            status: "active",
        });

        // Rollback organization creation if user creation fails
        if (!createdOrg) {
            await fs.promises.unlink(logoPath); // Delete uploaded logo
            return res.status(400).json({ message: "Failed to create organization" });
        }

        // Create the user
        const createdUser = await User.create({
            name,
            email: contact.email,
            password: hashedPassword,
            is_admin: true,
            emailVerificationToken: verificationToken,
            isEmailVerified: false,
            orgId: createdOrg._id,
        });

        // Rollback user creation if it fails
        if (!createdUser) {
            await Organization.deleteOne({ _id: createdOrg._id }); // Delete created organization
            await fs.promises.unlink(logoPath); // Delete uploaded logo
            return res.status(400).json({ message: "Failed to create user" });
        }

        // Send verification email to the user
        const emailOptions = {
            subject: "Account Verification",
            html: `<h1>Verify Your Account</h1>
            <h4>Hello ${name}, welcome to CollabPro! Thank you for choosing us. Please verify your account:</h4>
            <p>Please click the following link to verify your account:</p>
            <div><a href="http://localhost:3000/api/organizations/verifyOrganization/${verificationToken}" 
            style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Account</a> </div>`,
        };

        await sendEmail(contact.email, emailOptions.subject, emailOptions.html);

        // Send success response
        res.status(200).json({
            message: "Organization created successfully",
            organization: createdOrg,
            user: createdUser,
            verificationToken,
        });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};


const updateOrg = async (req, res) => {
    try {
        const orgId = req.params.id;
        const { name, address, type, contact, industry, website, logo } = req.body;

        // Validate required fields
        if (!name || !address || !type || !contact || !industry || !website) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // if the user in the params and auth middleware are the same in order to access the data
        const AuthOrgId = req.user.orgId
        const is_admin = req.user.is_admin
        if (!is_admin && AuthOrgId.toString() !== orgId) {
            return res
                .status(401)
                .json({ message: "Unauthorized to access this organization" });
        }
        // Find the organization to update
        const orgToUpdate = await Organization.findById(orgId);
        if (!orgToUpdate) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // Update organization fields
        orgToUpdate.name = name;
        orgToUpdate.address = address;
        orgToUpdate.type = type;
        orgToUpdate.contact = contact;
        orgToUpdate.industry = industry;
        orgToUpdate.website = website;

        // Update logo if provided
        if (logo) {
            const logoPath = await handleLogo(logo);
            orgToUpdate.logo = logoPath;
        }

        // Save the updated organization
        const updatedOrg = await orgToUpdate.save();

        // Send success response
        res.status(200).json({ message: "Organization updated successfully", organization: updatedOrg });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: error.message });
    }
};


const deleteOrg = async (req, res) => {
    try {
        const orgId = req.params.id.trim();

        // Validate if the provided organization ID is a valid MongoDB ObjectID
        if (!mongoose.Types.ObjectId.isValid(orgId)) {
            return res.status(404).json({ message: "Invalid organization ID" });
        }

        //get the user id from the auth middleware
        const AuthOrgId = req.user.orgId
        const is_admin = req.user.is_admin

        //check if the  user in the params and auth middleware are the same in order to access the data
        if (!is_admin && AuthOrgId.toString() !== orgId) {
            return res
                .status(401)
                .json({ message: "Unauthorized to access this organization" });
        }

        //delete the organization and associated users
        const deletedOrg = await Organization.findByIdAndDelete(orgId);
        if (!deletedOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const deletedUsers = await User.deleteMany({ orgId: deletedOrg._id });
        if (!deletedUsers) {
            return res.status(404).json({ message: "Associated users not found" });
        }
        res.status(200).json({ message: "Organization and associated users deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyOrganization = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ emailVerificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.orgId.trim().toString() !== req.user.orgId.trim().toString()) {
            res.status(401).json({ message: "Unauthorized to access this organization" });
        }
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        await user.save();
        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrg, getOrgById, createOrg, updateOrg, deleteOrg, verifyOrganization };
