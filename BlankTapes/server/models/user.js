const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // Add id field
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false }, // Hide by default
    role: { type: String, default: 'ADMIN', uppercase: true }, // Default ADMIN, uppercase
    status: { type: String, default: 'ACTIVE', uppercase: true }, // Default ACTIVE, uppercase
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }, // camelCase
    username: { type: String, required: true, unique: true },
  },
  { 
    collection: 'user-data',
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password; // Hide password in JSON
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('User', UserSchema);