const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const dotEnv = require("dotenv");

dotEnv.config();
const registration = async(req,res) => {
     const {name,email,password,role} = req.body;
     try{
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
      console.log("Registered")

     }catch(error){
      console.log("Registration error => ",error.message)              
      res.status(500).json({error:message.error})
     }

}

const login = async(req,res)=>{
    const {email,password}=req.body;
    try{
       const user = await User.findOne({email});
       if(!user || !(await bcrypt.compare(password,user.password))){
          return res.status(401).json({message:"Invalid username or password"})
       } 
       const token = jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1h"})
       res.status(200).json({message:"Login successful..!",token}) 
       console.log("login successfull")           
    }catch(error){
       console.log("login error")             
       res.status(500).json({message:error.message})             
    }
}

module.exports={registration,login}