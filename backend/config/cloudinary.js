const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dj8aysbhb',
  api_key: '871965672473696',
  api_secret: 'HzLsRRIHadMA7l8cl_TgNahUTFM'
});

module.exports = cloudinary;