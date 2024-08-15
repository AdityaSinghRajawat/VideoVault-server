import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.js"
import { verifyJWT } from "../middlewares/auth.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:subscriberId")
    .get(getSubscribedChannels)
    .post(toggleSubscription);

router.route("/u/:channelId").get(getUserChannelSubscribers);

export default router;