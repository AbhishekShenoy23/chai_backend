import dotenv from "dotenv"
//require('dotenv').config({path:"./env"})
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({path:'./env'})


connectDB().then(()=>{
app.on("error",(error)=>
{
    console.log("Error on app server",error)
    throw error
})
app.listen(process.env.PORT||8000 ,()=>
{
    console.log(`Server listening on Port ${process.env.PORT}`)
})

})
.catch((err)=>{console.log("error in mongo connection failed!!",err)
              })