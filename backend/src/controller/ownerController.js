import { Owner } from "../model/ownerModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs'


export const registerOwner = async(req, res)=>{
    const {name, email, password, confirmPassword} = req.body;

    try {
        const ownerExist = await Owner.findOne({email});
        if(ownerExist){
            return res.status(StatusCodes.CONFLICT).json({message:"owner already exist"});
        }
        if(password != confirmPassword){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"Password and confirm password does not match"})
        }
        const saltRound =10;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const newOwner = new Owner({
            name,
            email,
            password:hashPassword,
            role:'owner'
        });
        const newOwnerCreated = await newOwner.save();

        if(!newOwnerCreated){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"internal server error"});
        }
         res.status(StatusCodes.OK).json({message:"Owner is registered successfully"});
    } catch (error) {
        console.log("error", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"internal server error"});
        
    }
}