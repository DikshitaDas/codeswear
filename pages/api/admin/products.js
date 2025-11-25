import connectDb from "../../../middleware/mongoose";
import Product from "../../../models/Product";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });

    if (req.method === 'GET') {
      const products = await Product.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ success: true, products });
    }

    if (req.method === 'POST') {
      const body = Array.isArray(req.body) ? req.body : [req.body];
      const created = await Product.insertMany(body);
      return res.status(201).json({ success: true, createdCount: created.length });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);


