import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,

}))

app.use(express.json({limit:"16kb"}))
//For json comin in the request 


app.use(express.urlencoded({extended:true,limit:"16kb"}))
 //data coming from the URL needs to be handled example in search
//when we give abhishek shenoy  .It may appear as abhishek+shenoy  or abhishek%20shenoy.
//express needs to understand it

app.use(express.static("public"))
//for public folders 

//secure cookies can be kept in user browser
app.use(cookieParser())

export {app}