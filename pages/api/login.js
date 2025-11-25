import User from "../../models/User";
import connectDb from "../../middleware/mongoose";
var CryptoJS = require("crypto-js");

var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body || {};
    if (!email || !password) {  
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Decrypt password
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.ENCRYPTION_KEY);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

    const isPasswordValid = password === decryptedPassword;

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    var token = jwt.sign(
      {
        message: "Login successful",
        user: userResponse,
      },
      process.env.JWT_SECRET,
      {expiresIn: "7d"}
    );

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);
