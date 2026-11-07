import multer from "multer";
import { AppError } from "../helpers/AppError";

const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "application/pdf",
]);

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_FILES = 10;

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: MAX_FILES },
    fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
            return cb(new AppError("Only JPG, PNG, WebP, AVIF, SVG or PDF files are allowed", 400));
        }

        cb(null, true);
    },
});
