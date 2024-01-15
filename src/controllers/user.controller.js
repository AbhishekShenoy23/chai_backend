import { ApiError } from "../utils/ApiError.js";
import { asyncHandlers } from "../utils/asyncHandlers.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { APiResponse } from "../utils/ApiResponse.js";

 async function generateAccessAndRefreshToken(user) {

   
    const accessToken =  user.generateAccessToken();
    const refreshToken =  user.generaterefreshToken();
   //refresh token needs to be saved in mongoDB hence making a save call.
    user.refreshToken = refreshToken
    
    await user.save({ validateBeforeSave: false })


    return {accessToken,refreshToken}


}



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



const avatarLocalPath = req.files?.avatar[0].path;


let coverImageLocalPath =""
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
{
    coverImageLocalPath=req.files.coverImage[0].path;
}


if(!avatarLocalPath)
{
 throw new ApiError(400,"Avatar is Required")
}

const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

if(!avatar)
{
    throw new ApiError(400,"Avatar is Required")
} 


 const user = await User.create({
    username:username.toLowerCase(),
    password,
    fullName,
    email,
    avatar:avatar.url,
    coverImage: coverImage.url||""

}) 


const createdUser = await User.findById(user._id).select("-password -refreshToken")

if(!createdUser)
{
    throw new ApiError(500,"Failed to register a User")
}

return res.status(201).json(new APiResponse(200,createdUser,"User created successfully"))

})


const userLogin = asyncHandlers(async (req,res)=>{

//fetch usernam and password from req.body
//check if username or eamil exist
//compare the password for match

//generate the access and refresh  token
//save the refresh token in the database
//send the refresh and access token to user.  
console.log(req)
const {email,username,password} = req.body

if(!username || !email)
{
    throw new ApiError(400,"No username or email found")
}

//check for password  use  the method from userschema.

const user = await User.findOne({$or:[{email},{username}]})

if(!user)
{
    throw new ApiError(400,"No user found")
}

const isPasswordMatch  = await user.isPasswordMatch(password)

if(!isPasswordMatch)
{
    throw new ApiError(400,"Invalid Credentials")
}

//now generate the access and refresh tokens for the user

  const {accessToken,refreshToken} =  await generateAccessAndRefreshToken(user);
console.log("access token" , accessToken)
// create a options which will be sent along with cookie

const options = {httpOnly:true, secure:true}

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

return res.status(200)
          .cookie("accessToken",accessToken,options)
          .cookie("refreshToken",refreshToken,options)
          .json(new APiResponse(200,loggedInUser,"Login Successful"))



    
})


const userLogout = asyncHandlers(async(req,res)=>{

  await  User.findByIdAndUpdate({_id:req.user._id},{$set:{refreshToken:undefined}},{new:true})
 
  const options = {httpOnly:true, secure:true}
  
  res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
  .json(new APiResponse(200,{},"Logged out Successfully"))

})

export {userRegister,userLogin,userLogout}