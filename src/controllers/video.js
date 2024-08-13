import mongoose, { isValidObjectId } from "mongoose"
import Video from "../models/video.js"
import User from "../models/User.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, getPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

    const match = {};

    if (query) {
        match.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    if (userId && isValidObjectId(userId)) {
        match.owner = new mongoose.Types.ObjectId(userId);
    }

    const sort = {};
    sort[sortBy] = sortType === 'asc' ? 1 : -1;

    const videos = await Video.aggregatePaginate(
        Video.aggregate([{ $match: match }]),
        {
            page,
            limit,
            sort
        }
    );

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description || !req.files) {
        throw new ApiError(400, "Title, description, and video file are required");
    }

    const videoFileLocalPath = req.files?.videoFile[0].path;
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);

    if (!videoFile) {
        throw new ApiError(500, "Error uploading video to Cloudinary");
    }

    const thumbnailLocalPath = req.files?.thumbnail[0].path;
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail?.url || "",
        duration: videoFile.duration,
        owner: req.user._id
    });

    return res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"));
});


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate('owner', 'username avatar');

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const thumbnailPath = req.file?.path;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (thumbnailPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (thumbnail) updateData.thumbnail = thumbnail.url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, { $set: updateData }, { new: true });

    if (!updatedVideo) {
        throw new ApiError(404, "Video not found or failed to update");
    }

    return res.status(200).json(new ApiResponse(200, updatedVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const videoToDelete = await Video.findById(videoId);

    const videoFilePublicId = getPublicIdFromUrl(videoToDelete.videoFile);
    const thumbnailPublicId = getPublicIdFromUrl(videoToDelete.thumbnail);

    await deleteFromCloudinary(videoFilePublicId, 'video');
    await deleteFromCloudinary(thumbnailPublicId);

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    console.log(deleteVideo);


    if (!deletedVideo) {
        throw new ApiError(404, "Video not found or failed to delete");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"));
});


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? 'published' : 'unpublished'} successfully`));
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}