import Product from "../../models/Product";
import connectDb from "../../middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id, title, slug, description, image, category, price, availableQty, size, variant, color } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: "Product ID is required" });
      }

      // Update the product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { title, slug, description, image, category, price, availableQty, size, variant, color },
        { new: true, runValidators: true } // return the updated document and validate
      );

      if (!updatedProduct) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);

