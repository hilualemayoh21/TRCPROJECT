import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from '../../utils/api';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const avatarDir = path.join(process.cwd(), 'uploads/avatars');
const researcherDocDir = path.join(process.cwd(), 'uploads/researcher-docs');
ensureDir(avatarDir);
ensureDir(researcherDocDir);

const avatarStorage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, avatarDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const userId = req.user?.id || 'anonymous';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const imageFileFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.', 400), false);
  }
};

export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

const researcherDocStorage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    cb(null, researcherDocDir);
  },
  filename: (req: any, file: any, cb: any) => {
    const userId = req.user?.id || 'anonymous';
    const field = file.fieldname || 'document';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${field}-${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const researcherDocFilter = (_req: any, file: any, cb: any) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid document type. Upload PDF, DOCX, or image files only.', 400), false);
  }
};

export const researcherApplicationUpload = multer({
  storage: researcherDocStorage,
  fileFilter: researcherDocFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
