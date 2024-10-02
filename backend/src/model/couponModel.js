import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
      unique: true
    },
    discount: {
      type: Number, 
      required: true
    },
    expirationDate: {
      type: Date,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {timestamp:true}
);

export const Coupon = mongoose.model('Coupon', couponSchema);