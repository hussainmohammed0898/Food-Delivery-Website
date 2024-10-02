import { User } from "../model/userModel.js"
import { StatusCodes } from "http-status-codes";
import bcrypt from 'bcryptjs'
import { generalToken } from "../general utilities/token.js";

export const userRegister = async(req, res)=>{
    const {name, email, password, confirmPassword, address} = req.body
    
    try {
        if (
            !name &&
            name.trim() === "" &&
            !email &&
            email.trim() === "" &&
            !password &&
            password.trim() === ""&&
            !confirmPassword &&
            confirmPassword.trim() === ""&&
            !address &&
            address.trim() === ""
          ) {
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: "Invalid Inputs" });
          }
    
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"user already exist"});
        }

        if(password != confirmPassword){
            return res.status(StatusCodes.NOT_ACCEPTABLE).json({message:"Password and confirm password does not match"});
        }

        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);

        const newUser = new User({
            name,
            email,
            password:hashPassword,
        });

        const newUserCreated = newUser.save();

        if(!newUserCreated){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"something went wrong"});
        };
    
        res.status(StatusCodes.CREATED).json({message:"signup successfully completed"});
    } catch (error) {
        console.log(error.message);
        return res.status(error.message || StatusCodes.INTERNAL_SERVER_ERROR).json({message:"Internal server error"});  
    }

}

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (!email || email.trim() === "" || !password || password.trim() === "") {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid Inputs" });
    }

  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Incorrect password" });
    }

  
    const token = generalToken(user);
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
};
export const logout = (req, res) => {
    try {
      res.clearCookie('access_token', { httpOnly: true, sameSite: 'None', secure: true });
      res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };

  export const logoutUser = (req, res) => {
    try {
      res.clearCookie('access_token', { httpOnly: true, sameSite: 'None', secure: true });
      res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  
    } catch (error) {
      console.error('Error logging out:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
    }
  };

export const getUserProfile = async(req, res)=>{
    try {
        
    const userId = req.user.id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(StatusCodes.NOT_FOUND).json({message:"user not found"})
    }

    const userData = {
        name: user.name,
        email: user.email
    };
    res.json(userData);
    console.log('userData:', userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });  
    }
}

export const deleteUser = async(req, res)=>{
    try {
        const userId = req.user.id
        await User.findByIdAndDelete(userId)

        if (!user) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        return res.status(StatusCodes.ACCEPTED).json({message:"user account deleted successfully"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message:"internal server error"});
    }
}