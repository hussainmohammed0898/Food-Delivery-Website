import mongoose from "mongoose";

const userSchema = new mongoose.Schema (
    {
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
            required:true,
            minLength:6,
        },
        address: {
            type: String,
          },
          role: {
            type: String,
            enum: ['user'],
            
        },
        orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
          }]
    },
    {timestamps:true}
)
export const User = mongoose.model('User', userSchema);