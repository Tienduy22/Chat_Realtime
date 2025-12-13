import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Danh sách mime types được phép
const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
];
const ALLOWED_DOCUMENT_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
];
const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/webm",
    "video/x-msvideo",
];

const uploadCloudinary = async (req, res, next) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return next();
        }

        // Khởi tạo các mảng kết quả
        req.uploadedImageUrls = []; // giữ nguyên tên cũ cho ảnh
        req.uploadedDocumentUrls = [];
        req.uploadedVideoUrls = [];

        const uploadPromises = files.map((file) => {
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
                "base64"
            )}`;

            let options = {
                folder: "BSV",
            };

            if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
                // Ảnh: giữ nguyên như cũ
                options.folder = "BSV/images";
                return cloudinary.uploader.upload(base64, options);
            } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
                // Tài liệu: dùng resource_type = raw
                options.folder = "BSV/documents";
                options.resource_type = "raw";
                return cloudinary.uploader.upload(base64, options);
            } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
                // Video
                options.folder = "BSV/videos";
                options.resource_type = "video";
                return cloudinary.uploader.upload(base64, options);
            } else {
                // File không hỗ trợ → bỏ qua hoặc có thể throw error tùy nhu cầu
                return Promise.resolve(null);
            }
        });

        const results = await Promise.all(uploadPromises);

        results.forEach((result, index) => {
            if (!result) return; // file không hỗ trợ

            const file = files[index];

            if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
                req.uploadedImageUrls.push(result.secure_url);
            } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
                req.uploadedDocumentUrls.push(result.secure_url);
            } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
                req.uploadedVideoUrls.push(result.secure_url);
            }
        });

        next();
    } catch (error) {
        console.error("Lỗi upload Cloudinary:", error);
        res.status(500).json({ message: "Upload thất bại" });
    }
};

export { upload, uploadCloudinary };
