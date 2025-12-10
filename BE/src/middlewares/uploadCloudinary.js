import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

const uploadCloudinary = async (req, res, next) => {
    try {
        const images = req.files
        if (!images || images.length === 0) {
            return next()
        }

        const uploadPromises = images.map(file => {
            const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
            return cloudinary.uploader.upload(base64Image, {
                folder: 'BSV',
            })
        })

        const results = await Promise.all(uploadPromises)
        req.uploadedImageUrls = results.map(r => r.secure_url)
        
        next()
    } catch (error) {
        console.error('Lỗi upload Cloudinary:', error)
        res.status(500).json({ message: 'Upload thất bại' })
    }
}

export { upload, uploadCloudinary }
