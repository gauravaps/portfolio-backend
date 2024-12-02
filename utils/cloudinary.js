const fs =require('fs');
const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.CLOUD_API_KEY, 
    api_secret:process.env.CLOUD_API_SECRET,
  });
  
  const uploadonCloudinary=async(localFilepath)=>{
      try {
          if(!localFilepath) return null
  
          //upload the file on cloudinary+++++
      const response= await cloudinary.uploader.upload(localFilepath,{
              resource_type:'auto'
          })
          // file has been uploaded successfully+++
          //console.log('file is uploaded on cloudinary',response.url);
          fs.unlinkSync(localFilepath)
          return response;
  
  
      } catch (error) {
           fs.unlinkSync(localFilepath) // remove the locally saved temporary file as the upload operation got failed
           return null
          
      }
  }

  module.exports =uploadonCloudinary;