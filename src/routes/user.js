import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.js";

const router = Router();

// router.post("/register",
//     upload.fields([
//         { name: 'avatar', maxCount: 1 },
//         { name: 'coverImage', maxCount: 1 }
//     ]),
//     registerUser
// );

router.post("/register",
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'coverImage', maxCount: 1 }
    ]),
    registerUser
);

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("refresh-token", refreshAccessToken);

export default router;