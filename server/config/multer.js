// /config/multer.js
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

const upload = multer({ storage });

export default upload;
