import connectDb from "../../middleware/mongoose";
import Order from "../../models/Order";
import User from "../../models/User";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Incoming order data:", req.body);
    const { orderId, items, total, customerInfo, paymentMethod } = req.body;

    // Validate required fields
    if (!orderId || !items || !total || !customerInfo) {
      console.error("Missing required order fields:", req.body);
      return res.status(400).json({ 
        error: "Missing required fields: orderId, items, total, customerInfo" 
      });
    }

    // Validate customer info
    const { email, name, phone, address, city, pincode } = customerInfo;
    if (!email || !name || !phone || !address || !city || !pincode) {
      return res.status(400).json({ 
        error: "Missing required customer information" 
      });
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'card', 'upi', 'netbanking'];
    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ 
        error: "Invalid payment method" 
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user exists, if not create a new user (guest user)
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // Create a new user for this order (guest user without password)
      user = new User({
        name,
        email: normalizedEmail,
        password: `guest_${Date.now()}`, // Temporary password for guest users
        role: 'user'
      });
      await user.save();
      console.log("Created new user for order:", user._id);
    } else {
      // Update existing user's name if it's different
      if (user.name !== name) {
        user.name = name;
        await user.save();
        console.log("Updated user name:", user._id);
      }
    }

    // Validate items structure
    if (typeof items !== 'object' || Object.keys(items).length === 0) {
      return res.status(400).json({ 
        error: "Invalid or empty items" 
      });
    }

    // Create products array from items
    const products = Object.keys(items).map((key) => {
      const item = items[key];
      if (!item.name || !item.price || !item.qty) {
        throw new Error(`Invalid item data for key: ${key}`);
      }
      return {
        name: item.name,
        slug: key,
        size: item.size || '',
        variant: item.variant || '',
        qty: parseInt(item.qty) || 1,
        price: parseFloat(item.price) || 0,
      };
    });

    // Create new order
    const newOrder = new Order({
      user: user._id,
      orderId,
      products,
      amount: parseFloat(total) || 0,
      email: normalizedEmail,
      name,
      phone,
      address,
      city,
      pincode,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: "Pending",
      orderStatus: "Processing",
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved successfully:", savedOrder._id);

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      orderId: savedOrder.orderId,
      order: savedOrder,
    });
  } catch (error) {
    console.error("Place order error:", error.message, error.stack);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: "Order ID already exists. Please try again." 
      });
    }
    
    return res.status(500).json({ 
      error: "Failed to place order. Please try again." 
    });
  }
};

export default connectDb(handler);
