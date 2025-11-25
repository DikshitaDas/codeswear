import User from "../../models/User";
import connectDb from "../../middleware/mongoose";

var CryptoJS = require("crypto-js");

const handler = async (req, res) => {
  if (req.method === "GET"){
    return res.status(200).json({success: true});
  }

  if (req.method === "POST") {
    try {
      console.log("Processing POST request...");
      const { name, email, password } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        console.log("Validation failed - missing fields");
        return res.status(400).json({ 
          error: "All fields are required",
          missing: {
            name: !name,
            email: !email,
            password: !password
          }
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("Validation failed - invalid email");
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Validate password length
      if (password.length < 6) {
        console.log("Validation failed - password too short");
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }

      console.log("All validations passed, checking for existing user...");

      // Check if user already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        console.log("User already exists");
        return res.status(400).json({ error: "User with this email already exists" });
      }

      console.log("Creating new user...");

      const user = new User({ 
        name, 
        email: email.toLowerCase(), 
        password: CryptoJS.AES.encrypt(req.body.password, process.env.ENCRYPTION_KEY).toString()
      });

      await user.save();
      console.log("User created successfully:", user.email);

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({ 
        success: true, 
        message: "User created successfully",
        user: userResponse 
      });

    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    }
  } else {
    console.log("Method not allowed:", req.method);
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default connectDb(handler);
