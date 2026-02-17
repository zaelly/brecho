<<<<<<< HEAD
// Configuração do Cloudinary
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfdeegoar',
  api_key: process.env.CLOUDINARY_API_KEY || '871965672473696',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'HzLsRRIHadMA7l8cl_TgNahUTFM'
=======
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dj8aysbhb',
  api_key: '871965672473696',
  api_secret: 'HzLsRRIHadMA7l8cl_TgNahUTFM'
>>>>>>> dcadcf6228dda8625a0f05152a88b14399d4e70d
});

module.exports = cloudinary;