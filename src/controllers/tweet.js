import mongoose, { isValidObjectId } from "mongoose"
import Tweet from "../models/tweet.js"
import User from "../models/User.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { _id: userId } = req.user;

    if (!content.trim()) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const newTweet = await Tweet.create({
        content,
        owner: userId
    });

    return res.status(201).json(new ApiResponse(201, newTweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId }).populate("owner", "username avatar");

    if (!tweets.length) {
        throw new ApiError(404, "No tweets found for this user");
    }

    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if (!content.trim()) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { content },
        { new: true }
    ).populate("owner", "username avatar");

    if (!updatedTweet) {
        throw new ApiError(404, "Tweet not found");
    }

    return res.status(200).json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) {
        throw new ApiError(404, "Tweet not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}