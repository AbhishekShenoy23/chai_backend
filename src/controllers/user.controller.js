import { ApiError } from "../utils/ApiError.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { User } from "../models/user.models.js";


const userRegister = asyncHandlers(async(req,res)=>{

// Fetch the data and file information from frontend.
// check if user already exists.  using email and username as these are unique
// validate if amy fields coming in are empty
// Fetch file from front end store it in tem loc.
// get the path of temp loc
// move the file to cloudinary and get the reponse url.
// check for success or failure while uploading avatar and cover image
//create the user 
// send the response to the frontend.


const {email,username,fullName,password} = req.body

if([email,username,fullName,password].some((field)=> field?.trim()=== ""))
{
    throw new ApiError(400,"All fields are Mandatory")
}

const existedUser = await User.findOne({$or:[{email},{username}]})

if(existedUser) 
throw new ApiError(409,"User Already Exists")



})



export {userRegister}