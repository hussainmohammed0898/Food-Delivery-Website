import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true
    },
    image: {
      type: String, 
      required: true
    },
    openingHours: {
      type: String, 
      required: true
    },
    cuisineType: {
      type: String, 
      required: true
    },
    menu: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    }],
  },
  {timestamps:true}
);
export const Restaurant = mongoose.model('Restaurant', restaurantSchema);