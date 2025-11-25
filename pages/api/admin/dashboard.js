import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded?.user?.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const [orders, products, users] = await Promise.all([
      Order.find().lean(),
      Product.find().lean(),
      User.find().lean(),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    // Month (MMM) helper
    const getMonth = (d) => new Date(d).toLocaleString("default", { month: "short" });

    // ordersByMonth (existing line chart)
    const ordersByMonth = orders.reduce((acc, o) => {
      const month = getMonth(o.createdAt);
      const i = acc.findIndex((m) => m.month === month);
      if (i >= 0) acc[i].sales += Number(o.amount) || 0;
      else acc.push({ month, sales: Number(o.amount) || 0 });
      return acc;
    }, []);

    // Build slug -> category map for attribution
    const slugToCategory = new Map(products.map((p) => [p.slug, (p.category || 'other').toString().toLowerCase()]));

    // Aggregate sales by category per month using order items
    // Each order.products item: { slug, price, qty }
    const catMonthMap = new Map(); // key: `${month}|${category}` -> sales
    orders.forEach((o) => {
      const month = getMonth(o.createdAt);
      (o.products || []).forEach((it) => {
        const slug = it.slug || "";
        const category = slugToCategory.get(slug) || 'other';
        const revenue = (Number(it.price) || 0) * (Number(it.qty) || 0);
        const key = `${month}|${category}`;
        catMonthMap.set(key, (catMonthMap.get(key) || 0) + revenue);
      });
    });

    // Normalize to array: [{ month, category, sales }]
    const salesByCategoryMonth = Array.from(catMonthMap.entries()).map(([key, sales]) => {
      const [month, category] = key.split('|');
      return { month, category, sales };
    });

    res.status(200).json({
      totalSales,
      ordersCount: orders.length,
      productsCount: products.length,
      usersCount: users.length,
      recentOrders: orders.slice(-5).reverse(),
      ordersByMonth,
      salesByCategoryMonth,
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);
