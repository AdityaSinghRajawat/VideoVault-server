import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from './routes/user.js';
import healthcheckRouter from "./routes/healthcheck.js";
import tweetRoutes from "./routes/tweet.js";
import subscriptionRoutes from "./routes/subscription.js";
import videoRoutes from "./routes/video.js";
import commentRoutes from "./routes/comment.js";
import likeRoutes from "./routes/like.js";
import playlistRoutes from "./routes/playlist.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb", extended: true }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/tweets", tweetRoutes)
app.use("/api/v1/subscriptions", subscriptionRoutes)
app.use("/api/v1/videos", videoRoutes)
app.use("/api/v1/comments", commentRoutes)
app.use("/api/v1/likes", likeRoutes)
app.use("/api/v1/playlist", playlistRoutes)
app.use("/api/v1/dashboard", dashboardRoutes)

export { app } 
