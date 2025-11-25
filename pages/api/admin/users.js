import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });

    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, users });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);


