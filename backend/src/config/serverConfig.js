import dotenv from 'dotenv';

dotenv.config();

export default {
    port : process.env.PORT || 3000,
    db : process.env.DB_URL || "",
    token : process.env.USER_TOKEN_SECRET_KEY,
    adminToken : process.env.ADMIN_TOKEN_KEY
}