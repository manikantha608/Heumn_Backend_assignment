const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true,
        unique:true            
    },
    password : {
        type:String,
        required:true            
    },
     role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  }, 
//   role:{
//     type:[
//         {
//             type:String,
//             enum:["admin", "member"],
//             default:"member"
//         }
//     ]
//   }               
})

const User = mongoose.model("User",UserSchema)
module.exports = User;