import AdminModel from '../models/AdminModel.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// 🔹 Admin Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Admin User doesn't exist" });
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
};

// 🔹 Create Admin Manually (only once, for setup)
const createAdmin = async () => {
  try {
    const existing = await AdminModel.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("✅ Admin already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const admin = new AdminModel({
      name: "Super Admin",
      mobile: 9876543210,
      email: "admin@example.com",
      password: hashedPassword
    });

    await admin.save();
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

export { loginUser, createAdmin };
