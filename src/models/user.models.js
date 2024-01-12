import mongoose,{Schema,model} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema  = new Schema({
    username:{
        type:String, 
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String, 
        required:true,
        unique:true,
        lowercase:true,
        trim:true
        
    },
    fullName:{
        type:String, 
        required:true,
        trim:true
    },
    avatar:{
        type:String , //cloudinary url
        required:true
    },
    coverImage:{
        type:String , 
    },
    watchHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
    ],
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    refreshToken:{
        type:String
    }


},{timestamps:true})

userSchema.pre("save",async function(next){

    if(this.isModified("password"))
    {
        this.password= await bcrypt.hash(this.password,8)
       next()
    }

})

userSchema.methods.isPasswordMatch = async function (password)
{
 return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken =  function ()
{
    jwt.sign({
    _id:this._id,
    email:this.email,
    username:this.username,
    fullName:this.fullName
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRE})
}

userSchema.methods.generaterefreshToken = function()
{
    jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_ROKEN_EXPIRE
    }
    )
}


export const User = model("User",userSchema)