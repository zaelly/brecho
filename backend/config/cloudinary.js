// Configuração do Cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfdeegoar',
  api_key: process.env.CLOUDINARY_API_KEY || '871965672473696',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HzLsRRIHadMA7l8cl_TgNahUTFM'
});

module.exports = cloudinary;