import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../errors/AppError';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads/avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // @ts-ignore - user is attached by auth middleware
    const userId = req.user?.id || 'anonymous';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG and WebP are allowed.', 400), false);
  }
};

export const avatarUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});
