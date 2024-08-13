import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        console.log("File has been successfully uploaded", response.url);
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localFilePath);
        // Remove the locally saved temperary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

        if (response.result === "ok") {
            console.log("File has been successfully deleted from Cloudinary");
            return response;
        } else {
            console.error("Failed to delete file from Cloudinary:", response);
            return null;
        }

    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        return null;
    }
};

const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const publicIdWithExtension = parts[parts.length - 1];
    const publicId = publicIdWithExtension.split('.')[0];
    return publicId;
};

export { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl };