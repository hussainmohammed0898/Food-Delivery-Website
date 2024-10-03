import jwt from 'jsonwebtoken';
import serverConfig from '../config/serverConfig';
import { StatusCodes } from 'http-status-codes';

function authenticateOwner(req, res, next){
    const token = req.cookies.access_token;
    jwt.verify(token, serverConfig.adminToken,(err, owner)=>{
        console.log("error:", err);
        if(err) return res.status(StatusCodes.FORBIDDEN)
             req.owner = owner
             next(); 
    })   
}

export default authenticateOwner

