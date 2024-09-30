const User = require("../models/User");
const jwt = require("jsonwebtoken")
const dotEnv = require("dotenv");

dotEnv.config()

const verifyToken = async(req,res,next)=>{
      const token = req.headers.token;
      
      if(!token){
         return res.status(401).json({message:"Token is required"})           
      }
      try{
         const decoded = jwt.verify(token,process.env.SECRET_KEY);
         console.log(decoded,"decoded")
         const user = await User.findById(decoded.userId)

         if(!user){
            return res.status(404).json({message:"user not found"})        
         }
         req.userId = user._id;
         next()
      }catch(error){
         console.log(error)
         res.status(500).json({message:"Invalid token"})
      }
}

module.exports = verifyToken;