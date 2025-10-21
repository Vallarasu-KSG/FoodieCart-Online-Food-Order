import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred during login" });
  }
}

// Generate JWT Token
const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET);  // Added token expiration
}


// Register User
const registerUser = async (req, res) => {
  const { name, mobile, password, email } = req.body;
  try {
    // Checking if user already exists
    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating mobile format (example: Indian mobile number format)
    if (!validator.isMobilePhone(mobile, 'en-IN')) {
      return res.json({ success: false, message: "Please enter a valid mobile number" });
    }

    // Validating email format & strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    
    if (password.length < 8) {
      return res.json({ success: false, message: "Password should be at least 8 characters long" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name,
      mobile: mobile,
      email: email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error occurred during registration" });
  }
}

export { loginUser, registerUser };
