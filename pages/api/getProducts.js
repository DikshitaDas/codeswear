import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  try {
    const products = await Product.find();
    const tshirts = {};

    for (let item of products) {
      // Remove the strict filtering to allow products with 0 or undefined availableQty
      // if (!(item.availableQty > 0)) continue; // skip out-of-stock

      // Ensure color and size are arrays
      const colors = Array.isArray(item.color) ? item.color.filter(Boolean) : [item.color].filter(Boolean);
      const sizes = Array.isArray(item.size) ? item.size.filter(Boolean) : [item.size].filter(Boolean);

      if (item.title in tshirts) {
        // merge unique colors
        for (const c of colors) {
          if (!tshirts[item.title].color.includes(c)) {
            tshirts[item.title].color.push(c);
          }
        }
        
        // merge unique sizes
        for (const s of sizes) {
          if (!tshirts[item.title].size.includes(s)) {
            tshirts[item.title].size.push(s);
          }
        }
      } else {
        tshirts[item.title] = JSON.parse(JSON.stringify(item));
        tshirts[item.title].color = colors;
        tshirts[item.title].size = sizes;
      }
    }

    res.status(200).json({ tshirts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
