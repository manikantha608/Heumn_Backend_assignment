const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const dotEnv = require("dotenv");

dotEnv.config();
const registration = async(req,res) => {
     const {name,email,password,role} = req.body;
     try{
      if(!name && !email && !password && !role){
         return res.status(400).json({message:"Please enter required fields name,email,password,role"})
      }
      const userEmail = await User.findOne({email});
      if(userEmail){
         return res.status(400).json({message:"Email already taken"})           
      }
      const hashPassword = await bcrypt.hash(password,10);
      
      const newUser = new User({
        name,
        email,
        password: hashPassword ,
        role           
      })
      await newUser.save();
      res.status(201).json({message:"user registered successfully..!"})

     }catch(error){             
      res.status(400).json({message:"Registration failed..!"})
     }

}

const login = async(req,res)=>{
    const {email,password}=req.body;
    try{
        if(!email && !password){
         return res.status(400).json({message:"Please enter required fields email,password"})
        }
       const user = await User.findOne({email}).select('+password')
       if(!user || !(await bcrypt.compare(password,user.password))){
          return res.status(401).json({message:"Invalid username or password"})
       } 
       user.password = undefined;
       const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1h"})
       res.status(200).json({message:"Login successful..!",token,user})            
    }catch(error){           
       res.status(400).json({message:"Login failed..!"})             
    }
}

module.exports={registration,login}