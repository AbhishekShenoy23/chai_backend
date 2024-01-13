import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

const uploadOnCloudinary = async(localfilePath)=>
{
    
    try{
      
      const response = await cloudinary.uploader.upload(localfilePath,{resource_type:"auto"})
        // Now the file has successfully uploaded to the cloudinary.
        //Fetch response to get the cloudinary url 
        // localfile path is a temp path in the server where file gets stored through multer
        console.log("Image uploaded to cloudinary!!", response.url)
        return response

    }
    catch (error)
    {
     fs.unlinkSync(localfilePath)
     return Null
    }
}


