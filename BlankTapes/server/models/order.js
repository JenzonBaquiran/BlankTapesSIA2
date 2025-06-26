const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true }, 
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['PROCESSING', 'SHIPPED', 'DELIVERED', 'PENDING'], 
      default: 'PENDING', 
      uppercase: true 
    },
    date: { type: Date, default: Date.now }
  },
  { collection: 'order-data' }
);

module.exports = mongoose.model('Order', OrderSchema);