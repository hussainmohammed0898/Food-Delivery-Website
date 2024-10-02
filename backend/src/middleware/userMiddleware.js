import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import serverConfig from '../config/serverConfig.js';

function authenticateUser(req, res, next){
    const token = req.cookies.access_token;
    console.log(token);

    jwt.verify(token, serverConfig.token, (err, user)=>{
        console.log("error:", err);
        if (err) return res.sendStatus(StatusCodes.FORBIDDEN);
        req.user = user;
        next();  
    })
}
export default authenticateUser;