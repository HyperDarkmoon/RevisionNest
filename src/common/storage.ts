import { diskStorage, Options } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const uploadDir = path.resolve(process.cwd(), 'uploads', 'profile-images');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const profileImageMulterOptions: Options = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9-_\.]/g, '_');
      cb(null, `${timestamp}_${safeOriginal}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};

export function relativeProfileImagePath(filename: string) {
  return path.join('uploads', 'profile-images', filename);
}
