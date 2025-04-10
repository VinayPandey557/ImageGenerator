import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req,res,next) => {
        const token = req.headers.authorization;
       

        if(!token){
            return res.status(411).json({
                success: false,
                message:"Unauthorized"
            })
    }

    try {
         const bearerToken = token.split(" ")[1];
         
         if(!bearerToken){
            return res.status(401).json({
                success: false,
                message: "Malformed token"
            })
         }
         const response = jwt.verify(bearerToken, JWT_SECRET);
         const user = await User.findById({_id: response._id});
         if(!user) {
            return res.status(401).json({ message: "Invalid token"})
         }
         req.user = { _id: user._id, email: user.email};
         next();
    } catch(error){
        console.log('JWT Verification error: ', error.name, error.message)
        return res.status(403).json({
            message: 'Incorrect creds'
        })
    }
}


export default authMiddleware;