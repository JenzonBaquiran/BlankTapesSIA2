const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String },
    category: { type: String, required: true }, 
    stock: { type: Number, required: true },    
    status: { type: String, default: 'ACTIVE', uppercase: true }, 
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'product-data' }
);

module.exports = mongoose.model('Product', ProductSchema);