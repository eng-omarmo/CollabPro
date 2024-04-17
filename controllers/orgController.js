const { hash } = require("bcrypt");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendEmail = require("../utility/mailer");

//controllers 




const getOrg = async (req, res) => {
    try {
        const getOrganization = await organization.find()
        if (!organization) {
            res.status(404).json({ message: "organization not found" })
        }
        res.status(200).json({ message: getOrganization })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getOrgById = async (req, res) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "invalid id" })
        }
        if (id !== req.user._id.toString().trim()) {
            return res.status(401).json({ message: "unauthorized" })
        }
        const getOrganization = await organization.findById(id)
        if (!organization) {
            res.status(404).json({ message: "organization not found" })
        }
        res.status(200).json({ message: "get org by id" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const createOrg = async (req, res) => {
    try {
        const { name, address, contact, industry, website, password } = req.body;

        // Check if all required fields are provided
        if (!name || !address || !contact || !industry || !website || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user with the provided email already exists
        const checkEmail = await User.findOne({ email: contact.email });
        if (checkEmail) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Check if organization with the provided name and email already exists
        const checkOrg = await Organization.findOne({ name: name });
        if (checkOrg) {
            return res.status(400).json({ message: "Organization already exists" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a verification token
        const verificationToken = generateRandomToken(20);

        // Create the user
        const createdUser = await User.create({
            name: name,
            email: contact.email,
            password: hashedPassword,
            is_admin: true,
            emailVerificationToken: verificationToken,
            isEmailVerified: false
        });

        if (!createdUser) {
            return res.status(400).json({ message: "Failed to create user" });
        }

        // Create the organization
        const createOrg = await Organization.create({
            name: name,
            address: address,
            contact: contact,
            industry: industry,
            website: website,
            userReferences: [createdUser._id],
            status: "pending"
        });

        if (!createOrg) {
            // Roll back user creation if organization creation fails
            await User.deleteOne({ _id: createdUser._id });
            return res.status(400).json({ message: "Failed to create organization" });
        }

        // Send verification email to the user
        const emailOptions = {
            subject: "Account Verification",
            html: `<h1>Verify Your Account</h1>
            <h4>Hello ${name}, welcome to CollabPro! Thank you for choosing us. Please verify your account:</h4>
            <p>Please click the following link to verify your account:</p>
            <a href="http://localhost:3000/api/users/verifyorganization/${verificationToken}" 
            style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Account</a>`
        };

        await sendEmail(contact.email, emailOptions.subject, emailOptions.html);

        res.status(200).json({ message: "Organization created successfully", organization: createOrg, user: createdUser, verificationToken: verificationToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateOrg = async (req, res) => {
    try {

        res.status(200).json({ message: "update org" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteOrg = async (req, res) => {
    try {
        res.status(200).json({ message: "delete org" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const verifyorganization = async (req, res) => {
    try {
        const { token } = req.params
        const user = await User.findOne({ emailVerificationToken: token })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.isEmailVerified = true
        user.emailVerificationToken = null
        await user.save()
        res.status(200).json({ message: "User verified successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getOrg, getOrgById, createOrg, updateOrg, deleteOrg }