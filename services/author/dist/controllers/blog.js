import getBuffer from "../utils/dataUri.js";
import { sql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitmq.js";
import TryCatch from "../utils/trycatch.js";
import { v2 as cloudinary } from "cloudinary";
export const createBlog = TryCatch(async (req, res) => {
    const { title, description, blogcontent, category } = req.body;
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file uploaded",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Error in file buffer",
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    });
    const result = await sql `INSERT INTO blogs (title, description, blogcontent, category, image,author)
    VALUES (${title}, ${description}, ${blogcontent}, ${category}, ${cloud.secure_url}, ${req.user?._id})RETURNING *`;
    await invalidateCacheJob([
        "blogs:*" // Invalidate all blogs cache
    ]);
    res.json({
        message: "Blog created successfully",
        blog: result[0],
    });
});
export const updateBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const { title, description, blogcontent, category } = req.body;
    const file = req.file;
    const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
        res.status(404).json({
            message: "Blog not found",
        });
        return;
    }
    if (blog[0].author !== req.user?._id) {
        res.status(403).json({
            message: "You are not authorized to update this blog",
        });
        return;
    }
    let imageUrl = blog[0].image;
    if (file) {
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(400).json({
                message: "Error in file buffer",
            });
            return;
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs"
        });
        imageUrl = cloud.secure_url;
    }
    const updatedBlog = await sql `UPDATE blogs SET title = ${title || blog[0].title}, description = ${description || blog[0].description}, blogcontent = ${blogcontent || blog[0].blogcontent}, category = ${category || blog[0].category}, image = ${imageUrl} WHERE id = ${id} RETURNING *`;
    await invalidateCacheJob([
        "blogs:*",
        `blogs:${id}` // Invalidate specific blog cache
    ]);
    res.json({
        message: "Blog updated successfully",
        blog: updatedBlog[0],
    });
});
export const deleteBlog = TryCatch(async (req, res) => {
    const { id } = req.params;
    const blog = await sql `SELECT * FROM blogs WHERE id = ${id}`;
    if (blog.length === 0) {
        res.status(404).json({
            message: "Blog not found",
        });
        return;
    }
    if (blog[0].author !== req.user?._id) {
        res.status(403).json({
            message: "You are not authorized to delete this blog",
        });
        return;
    }
    await sql `DELETE FROM savedblogs WHERE blogid = ${id}`;
    await sql `DELETE FROM blogs WHERE id = ${id}`;
    await sql `DELETE FROM comments WHERE blogid = ${id}`;
    await invalidateCacheJob([
        "blogs:*",
        `blog:${id}` // Invalidate specific blog cache
    ]);
    res.json({
        message: "Blog deleted successfully",
    });
});
