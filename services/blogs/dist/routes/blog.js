import express from "express";
import { getAllBlogs, getSingleBlog } from "../controllers/blog.js";
const router = express.Router();
router.get("/blogs/all", getAllBlogs);
router.get("/blogs/:id", getSingleBlog); // Assuming you want to use the same controller for single blog as well
export default router;
