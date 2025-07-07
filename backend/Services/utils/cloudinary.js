import {v2 as cloudinary} from 'cloudinary';
import 'dotenv/config'

cloudinary.config({ 
  cloud_name: 'ddrcdg0y9', 
  api_key: '313445665135798', 
  api_secret: process.env.Api_Secret_Cloudinary 
});

export default cloudinary
