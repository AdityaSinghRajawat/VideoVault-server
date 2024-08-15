import mongoose from "mongoose";
import User from "../models/User.js";
import Subscription from "../models/subscription.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Toggle subscription for a user (subscribe/unsubscribe)
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id; // Assuming user ID is available from auth middleware

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const existingSubscription = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });

    if (existingSubscription) {
        // If the subscription exists, remove it (unsubscribe)
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, null, "Unsubscribed successfully"));
    } else {
        // If the subscription doesn't exist, create it (subscribe)
        const subscription = await Subscription.create({ subscriber: subscriberId, channel: channelId });
        return res.status(201).json(new ApiResponse(201, subscription, "Subscribed successfully"));
    }
});

// Get the list of subscribers for a specific channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate('subscriber', 'username');

    if (subscribers.length === 0) {
        throw new ApiError(404, "No subscribers found");
    }

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers retrieved successfully"));
});

// Get the list of channels to which a user is subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const channels = await Subscription.find({ subscriber: subscriberId }).populate('channel', 'username');

    if (channels.length === 0) {
        throw new ApiError(404, "No subscribed channels found");
    }

    return res.status(200).json(new ApiResponse(200, channels, "Subscribed channels retrieved successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};
