const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Made optional for guest orders
		orderId: { type: String, unique: true, required: true }, // Custom order ID
		products: [
			{
				product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
				slug: { type: String },
				name: { type: String },
				size: { type: String },
				variant: { type: String },
				qty: { type: Number, default: 1 },
				price: { type: Number, required: true }
			}
		],
		amount: { type: Number, required: true },
		// Contact/shipping snapshot captured at checkout
		email: { type: String, lowercase: true, required: true },
		name: { type: String, required: true },
		phone: { type: String, required: true },
		address: { type: String, required: true },
		city: { type: String, required: true },
		pincode: { type: String, required: true },
		paymentMethod: { type: String, enum: ['cod', 'card', 'upi', 'netbanking'], required: true },
		// Status fields
		paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded'], default: 'Pending' },
		orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' }
	},
	{ timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);