const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: { type: String, required: true, unique: true, index: true },
		description: { type: String },
		image: { type: String },
		category: { type: String, enum: ['tshirt', 'hoodie', 'mug', 'sticker'], required: true },
		price: { type: Number, required: true },
		availableQty: { type: Number, default: 0 },
		size: { type: [String] },
		variant: { type: String },
		color: { type: [String] }     
	},
	{ timestamps: true }
);


module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);

