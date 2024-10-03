import { Owner } from "../model/ownerModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs'
import { adminGenerateToken } from "../general utilities/token.js";


export const registerOwner = async(req, res)=>{
    const {name, email, password, confirmPassword} = req.body;

    try {
        if (
            !name &&
            name.trim() === "" &&
            !email &&
            email.trim() === "" &&
            !password &&
            password.trim() === ""&&
            !confirmPassword &&
            confirmPassword.trim() === ""
          ) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Invalid Inputs" });
          }
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

export const ownerLogin = async(req, res)=>{
    const {email, password} = req.body
    try {
        if (!email || email.trim() === "" || !password || password.trim() === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Inputs" });
          }
        const owner =  await Owner.findOne({email});
        if(!owner){
            return res.status(StatusCodes.NOT_FOUND).json({message:"owner not found"});
        }
        console.log("hitting");
        const comparePassword = await bcrypt.compare(password, owner.password);
        console.log("compare", comparePassword);
        
        if(!comparePassword){
            return res.status(StatusCodes.CONFLICT).json({message:"Invalid password"})
        }

        const token= adminGenerateToken(owner);
        if (!token) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error generating token" });
          }
          res.cookie("access_token", token, {
            httpOnly: true,
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            sameSite: 'None',
            secure: true
          });
      
          res.status(StatusCodes.OK).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });  
    }
}

export const ownerLogout = (req, res)=>{
    try {
      const token = req.cookies.token;
    res.clearCookie('access_token',token,{ httpOnly: true});
    res.status(StatusCodes.ACCEPTED).json({ message: 'Logged out successfully' });
  
      
    } catch (error) {
      console.error('Error logging out:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      
    } 
  };

  export const checkOwner = async (req, res) => {
    console.log("hitting");
    
    const owner = req.owner;
    console.log(owner);
    
  try {
    const ownerData = await Owner.findOne({ _id: owner.data });
    if (!ownerData) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "owner not found", success: false });
    }
  
    if (ownerData.role !== "owner") {
      return res.status(StatusCodes.FORBIDDEN).json({message: "authentication failed", success: false  });
    }
  
    res.status(StatusCodes.CREATED).json({ message: "authenticateOwner", success: true });
  } catch (error) {
    console.error("Error while checking owner status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
  }
  };

  export const checkAdmin = async (req, res) => {   
    const owner = req.owner;
  
    
  try {
    const adminData = await Owner.findOne({ _id: owner.data });
    console.log(adminData);
    if (!adminData) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "owner not found", success: false });
    }
  
    if (adminData.role !== "admin") {
      return res.status(StatusCodes.FORBIDDEN).json({message: "authentication failed", success: false  });
    }
    res.status(200).json({ message: "authenticateAdmin", success: true });
  } catch (error) {
    console.error("Error while checking owner status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", success: false });
  }
}