const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: "dhbucitr2",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Log the configuration
console.log(cloudinary.config());
/////////////////////////
// Uploads an image file
/////////////////////////
exports.uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.url;
  } catch (error) {
    console.error(error);
  }
};
