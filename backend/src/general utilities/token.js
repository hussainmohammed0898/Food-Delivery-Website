import jwt from 'jsonwebtoken';
import serverConfig from '../config/serverConfig.js';

export const generalToken = (user)=>{
      try {
        const token = jwt.sign({data: user._id, email:user.email},serverConfig.token,{expiresIn: "1d"});
        return token
      } catch (error) {
        console.log(error);
      }
}

export const adminGenerateToken = (owner)=>{
  try {
    const token = jwt.sign({data:owner._id, role:owner.role},serverConfig.adminToken,{expiresIn: "1d"});
    return token
  } catch (error) {
    console.log(error); 
  }
}