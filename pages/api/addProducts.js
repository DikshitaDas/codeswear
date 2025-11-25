import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method == "POST") {
    const {
      title,
      slug,
      description,
      image,
      category,
      price,
      availableQty,
      size,
      variant,
      color,
    } = req.body;

    // Create new product
    const product = new Product({
      title,
      slug,
      description,
      image,
      category,
      price,
      availableQty,
      size,
      variant,
      color,
    });

    await product.save();

    res.status(201).json({ success: true, product });
  } else {
    res.status(400).json({ error: "this method is not allowed" });
  }
};

export default connectDb(handler);
