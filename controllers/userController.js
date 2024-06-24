const User = require("../models/userModel");
const mongoose = require("mongoose");
const sendEmail = require("../utility/mailer");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ForgetPassword = require('../models/ForgetPasswordModel');
const sendResponse = require("../utility/response");
const getUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      res.status(200).json({ message: "No user Found" });
    }
    res.status(200).json({
      message: user,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const getUserById = async (req, res) => {
  try {
    const id = req.params.id.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid user ID provided");
    }
    if (id !== req.user._id.toString().trim()) {
      return sendResponse(res, 401, false, "Unauthorized to fetch this user");
    }
    const user = await User.findById(id);
    if (!user) {
      return sendResponse(res, 404, false, "User not found");
    }

    sendResponse(res, 200, true, 'successfully feched user', user)
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    sendResponse(res, 500, false, 'internal server error')
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, is_admin, orgId } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !orgId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // // Check if is_admin is a valid boolean value
    // if (typeof is_admin !== "boolean") {
    //   return res
    //     .status(400)
    //     .json({ message: "is_admin must be true or false" });
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a verification token
    const verificationToken = generateRandomToken(20);

    // Create the user with email verification status as false and store the verification token
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_admin,
      orgId,
      emailVerificationToken: verificationToken,
      isEmailVerified: true,
    });

    //requirement has changed no need to send email verification

    // const emailOptions = {
    //   subject: "Account Verification",
    //   html: `<p>Please click the following link to verify your account:</p>
    //   <a href="http://localhost:3000/api/users/verify/${verificationToken}" 
    //   style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify Account</a>`,
    // };

    // // Send verification email to the user
    // await sendEmail(email, emailOptions.subject, emailOptions.html);

    // Return success response
    res
      .status(201)
      .json({
        message: "User created successfully. Verification email sent.",
        user,
      });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    if (id !== req.user._id.toString().trim()) {
      return res
        .status(401)
        .json({ message: "Unauthorized to fetch this user" });
    }
    const { name, email, password, is_admin } = req.body;

    // Check if at least one field is provided to update
    if (!name && !email && !password) {
      return res
        .status(400)
        .json({
          message:
            "At least one field (name, email, password) must be provided to update",
        });
    }

    // Check if user exists with the provided email
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== id) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
    }

    // Check password length
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password: hashedPassword, is_admin },
      { new: true }
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send success response with updated user data
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const id = req.params.id.trim();
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID provided" });
    }
    if (id !== req.user._id.toString().trim()) {
      return res.status(401).json({ message: "Unauthorized to delete this user" });
    }

    // Check if user is an admin
    const user = await User.findById(id);
    if (user.is_admin) {
      // If user is an admin, find the organization associated with the user
      const org = await Organization.findOne({ userReferences: id });
      if (!org) {
        return res.status(404).json({ message: "User does not have an organization" });
      }
      // Delete the organization
      await Organization.findByIdAndDelete(org._id);
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Failed to delete user" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      res.status(400).json({ message: "no token found in the request" });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;

    await user.save();

    res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const generateToken = (user) => {
  return jsonwebtoken.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

generateRandomToken = (n) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const verificationToken = generateRandomToken(20);

  await ForgetPassword.findOneAndUpdate(
    { email: email },
    {
      email: email,
      token: verificationToken,
      expiration: Date.now() + 3600000,
    },
    { upsert: true, new: true }
  );

  const emailOptions = {
    subject: "Password Reset",
    html: `<p>Please click the following link to reset your password:</p>
      <a href="http://localhost:3000/api/reset-password/${verificationToken}" 
      style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>`,
  };

  // Send verification email to the user
  await sendEmail(email, emailOptions.subject, emailOptions.html);

  res.status(200).json({ message: 'Password reset link has been sent to your email' });
}


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const passwordReset = await ForgetPassword.findOne({ token });

  if (!passwordReset || passwordReset.expiration < Date.now()) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  const user = await User.findOne({ email: passwordReset.email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.password = bcrypt.hashSync(password, 10); // Use bcrypt to hash the password
  await user.save();

  await ForgetPassword.deleteOne({ token });

  res.status(200).json({ message: 'Password has been reset successfully' });
}
// // Route to serve the password reset form

// const getResetPassword = async (req, res) => {
//   const { token } = req.params;

//   const passwordReset = await ForgetPassword.findOne({ token });

//   if (!passwordReset || passwordReset.expiration < Date.now()) {
//     return res.status(400).json({ message: 'Token is invalid or has expired' });
//   }

//   res.send(`
//     <form action="/reset-password/${token}" method="POST">
//       <input type="password" name="password" placeholder="New Password" required />
//       <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
//       <button type="submit">Reset Password</button>
//     </form>
//   `);
// }


module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  verifyUser,
  loginUser,
  resetPassword,
  forgetPassword,
  generateToken


};
