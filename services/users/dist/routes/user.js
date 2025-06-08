import express from 'express';
import { getUserProfile, loginUser, myProfile, updateUser, updateUserImage } from '../controllers/user.js';
import { isAuth } from '../middlewares/isAuth.js';
import uploadFile from '../middlewares/multer.js';
const router = express.Router();
router.post('/login', loginUser);
router.get('/me', isAuth, myProfile); // Assuming you have a myProfile controller
router.get('/user/:id', getUserProfile); // Assuming you have a myProfile controller
router.post('/user/update', isAuth, updateUser);
router.post('/user/update/pic', isAuth, uploadFile, updateUserImage);
export default router;
