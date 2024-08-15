import mongoose from "mongoose"
import Video from "../models/video.js"
import Subscription from "../models/subscription.js"
import Like from "../models/like.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Get total videos uploaded by the channel
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Get total views of all videos uploaded by the channel
    const totalViewsAgg = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsAgg.length > 0 ? totalViewsAgg[0].totalViews : 0;

    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Get total likes on videos
    const totalLikesAgg = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        { $unwind: "$videoData" },
        { $match: { "videoData.owner": new mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalLikes: { $sum: 1 } } }
    ]);
    
    const totalLikes = totalLikesAgg.length > 0 ? totalLikesAgg[0].totalLikes : 0;

    return res.status(200).json(new ApiResponse(200, { totalVideos, totalViews, totalSubscribers, totalLikes }, "Channel stats retrieved successfully"));
});


const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit, 10));

    const totalVideos = await Video.countDocuments({ owner: channelId });

    return res.status(200).json(new ApiResponse(200, { videos, totalVideos }, "Channel videos retrieved successfully"));
});


export {
    getChannelStats,
    getChannelVideos
}