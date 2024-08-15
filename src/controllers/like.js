import mongoose from "mongoose";
import Like from "../models/like.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle like on a video
const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id; // Assuming you have user ID from auth middleware

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const like = await Like.findOne({ video: videoId, likedBy: userId });

    if (like) {
        // If already liked, unlike it
        await like.remove();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
    } else {
        // If not liked yet, like it
        await Like.create({ video: videoId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Video liked successfully"));
    }
});

// Toggle like on a comment
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id; // Assuming you have user ID from auth middleware

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const like = await Like.findOne({ comment: commentId, likedBy: userId });

    if (like) {
        // If already liked, unlike it
        await like.remove();
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked successfully"));
    } else {
        // If not liked yet, like it
        await Like.create({ comment: commentId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Comment liked successfully"));
    }
});

// Toggle like on a tweet
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id; // Assuming you have user ID from auth middleware

    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const like = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (like) {
        // If already liked, unlike it
        await like.remove();
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked successfully"));
    } else {
        // If not liked yet, like it
        await Like.create({ tweet: tweetId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, null, "Tweet liked successfully"));
    }
});

// Get all liked videos
const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assuming you have user ID from auth middleware

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })
        .populate('video')
        .exec();

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos retrieved successfully"));
});

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
};
