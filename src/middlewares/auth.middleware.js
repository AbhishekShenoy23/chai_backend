import jwt from "jsonwebtoken"
import {asyncHandlers} from "../utils/asyncHandlers.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
 
const verifyJwt = asyncHandlers(async(req, _ ,next) =>
{
    
   try {
    //Learn to fetch cookie. Sometimes cookie cannot be set like in mobile , then use request headers Autorization
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    console.log(token ,"tokennnn")

    //If no token found
    if(!token)
    {
        throw new ApiError(400,"UnAuthorized Access")
    }

    console.log("Before decodedToken")
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log("decodedToken")
     console.log(decodedToken,"decode")
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if(!user)
    {
        throw new ApiError(401, "Invalid Access Token")
    }
    
    req.user = user
    next()
   } catch (error) {
    console.log(error)
    throw new ApiError(401,error?.message||"Something went wrong")
   }

})

export {verifyJwt}