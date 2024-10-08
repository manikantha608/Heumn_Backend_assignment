const express = require("express");
const app = express();
const dotEnv = require("dotenv")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const bookRoutes = require("./routes/bookRoutes")
const barrowRoutes = require("./routes/borrowRoutes")

dotEnv.config()

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("database is connected to server")})
.catch(()=>{ console.log("database is not connected to server")
})

app.use(express.json())

app.use("/", bookRoutes);

app.use("/user",userRoutes);
app.use("/book",bookRoutes);
app.use("/borrow",barrowRoutes)

app.listen(process.env.PORT,()=>{
  console.log("The server is running at port 5000")                  
})