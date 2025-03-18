import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();
//this is the configuration for cloudinary
cloudinary.config({  //this is the configuration for cloudinary
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process 
    .env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
}); 

export default cloudinary;

