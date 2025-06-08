import { sql } from "../utils/db.js";
import TryCatch from "../utils/TryCatch.js";
import axios from "axios";
import { redisClient } from "../server.js";

export const getAllBlogs = TryCatch(async (req, res) => {
  const { searchQuery="", category= "" } = req.query;

  const cachekey = `blogs:${searchQuery}:${category}`;
  const cachedBlogs = await redisClient.get(cachekey);


  const cached =await redisClient.get(cachekey);

  if (cached) {
    console.log("Cache hit for blogs");
     res.json(JSON.parse(cached));
     return;
  }
  let blogs;

  if (searchQuery && category) {
    blogs = await sql`
      SELECT * FROM blogs
      WHERE
        (title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`})
        AND (category = ${category})
      ORDER BY create_at DESC
    `;


  } else if (searchQuery) {
    blogs = await sql`
      SELECT * FROM blogs
      WHERE
        title ILIKE ${`%${searchQuery}%`} OR description ILIKE ${`%${searchQuery}%`}
      ORDER BY create_at DESC
    `;
  }
  else if (category) {
    blogs = await sql`
      SELECT * FROM blogs
      WHERE category = ${category}
      ORDER BY create_at DESC
    `;
  }
  else {
    blogs = await sql`
      SELECT * FROM blogs
      ORDER BY create_at DESC
    `;
  }

  console.log("Serving from db");
  // Store the blogs in cache
  await redisClient.set(cachekey, JSON.stringify(blogs), {
    EX: 60 * 60, // Cache for 1 hour
  });

  res.json(blogs);
});

// GET single blog
export const getSingleBlog = TryCatch(async (req, res) => {
  const { id } = req.params;


  const cachekey = `blog:${id}`;
  const cachedBlog = await redisClient.get(cachekey);

  if (cachedBlog) {
    console.log("Serving single  blog form redis cache");
    res.json(JSON.parse(cachedBlog));
    return;
  }
  console.log("Cache miss for blog");

  const blogResult = await sql`
    SELECT * FROM blogs
    WHERE id = ${id}
  `;

  if (blogResult.length === 0) {
    res.status(404).json({ message: "Blog not found" });
    return;
  }

  const blog = blogResult[0];

 const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${blog.author}`);


  const responseData = {
    blog:blog[0],
    author: data,
  };

  await redisClient.set(cachekey, JSON.stringify(responseData ), {

    EX: 3600, // Cache for 1 hour
  });
  res.json(responseData); // ✅ Don't return this
});