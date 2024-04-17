const User = require("../models/userModel");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      res.status(200).json({ message: "No user Found" });
    }
    res.status(200).json({
      message: user
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
    const { id } = req.params;
    if(!id) {
      res.status(400).json({ message: "no params provided" });
    }
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    // Logic to fetch user by ID goes here
    res.status(200).json({
      message: user
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, is_admin } = req.body;
    
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    // Check if is_admin is a valid boolean value
    if (typeof is_admin !== 'boolean') {
      return res.status(400).json({ message: "is_admin must be true or false" });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      is_admin
    });

    // Generate token
    const token = generateToken(user);
    if (!token) {
      return res.status(400).json({ message: "Failed to generate token" });
    }

    // Return success response with user data and token
    res.status(201).json({
      message: user, token
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const updateUser = (req, res) => {
  try {
    // Logic to update user information goes here
    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteUser = (req, res) => {
  try {
    // Logic to delete user goes here
    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const generateToken=(user) =>{
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
}
module.exports = {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
