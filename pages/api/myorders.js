import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import User from "../../models/User";
import Product from "../../models/Product";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const emailParam = String(req.query.email || "").toLowerCase().trim();
    if (!emailParam) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email: emailParam });

    // Fetch by either user ref (preferred) or fallback to email snapshot in order
    const query = user
      ? { $or: [ { user: user._id }, { email: emailParam } ] }
      : { email: emailParam };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Attach a representative thumbnail from the first product's slug
    const slugs = Array.from(new Set(
      orders.flatMap(o => (o.products || []).map(p => p.slug)).filter(Boolean)
    ));

    const slugToImage = {};
    if (slugs.length) {
      const products = await Product.find({ slug: { $in: slugs } }, { slug: 1, image: 1 }).lean();
      products.forEach(p => { slugToImage[p.slug] = p.image; });
    }

    const ordersWithThumb = orders.map(o => {
      const firstSlug = (o.products && o.products[0] && o.products[0].slug) || null;
      const orderThumb = firstSlug ? (slugToImage[firstSlug] || null) : null;
      return { ...o, orderThumb };
    });

    return res.status(200).json({ success: true, orders: ordersWithThumb });
  } catch (error) {
    console.error("Fetch my orders error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);


