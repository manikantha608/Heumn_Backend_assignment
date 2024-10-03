const User = require("../models/User");
const jwt = require("jsonwebtoken")
const dotEnv = require("dotenv");

dotEnv.config()

const verifyToken = async(req,res,next)=>{
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(400).json({ message: "Bearer token is required" });
       }
       const token = authHeader.split(' ')[1];
      
      // if(!token){
      //    return res.status(400).json({message:"Token is required"})           
      // }
      try{
         const decoded = jwt.verify(token,process.env.SECRET_KEY);
         const user = await User.findById(decoded.userId)

         if(!user){
            return res.status(404).json({message:"user not found"})        
         }
         req.userId = user._id;
         next()
      }catch(error){
         res.status(401).json({message:"Invalid token"})
      }
}

module.exports = verifyToken;