require('dotenv').config();
const cloudinary = require('./utils/cloudinary');

console.log('Testing Cloudinary connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connected successfully!', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:', error);
  });