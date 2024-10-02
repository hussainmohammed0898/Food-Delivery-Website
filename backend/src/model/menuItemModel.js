import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String, 
      required: true
    },
    category: {
      type: String, 
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  },
  {timestamps:true}
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema); 