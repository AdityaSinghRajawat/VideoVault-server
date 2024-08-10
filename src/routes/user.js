import { Router } from "express";
import registerUser from "../controllers/user.js";
import { upload } from "../middlewares/multer.js"

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


router.post('/test-upload', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.send('File uploaded');
});


export default router;