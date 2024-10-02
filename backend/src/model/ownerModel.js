import mongoose from "mongoose";

const ownerSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLength:6,
        required:true
    },
    role:{
        type:String,
        enum: ['admin', 'owner'],
        required: true
    },
    restaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant' 
      }],

},
{timestamps:true}
)

export const Owner = mongoose.model('Owner', ownerSchema);
