const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get('/api/blogs', async (req, res) => {   
    const blogs = await Blog.find({});
    return res.json(blogs);
});

blogRouter.post('/api/blogs', async (req, res) => {
    const blog = new Blog(request.body);
    const result = await blog.save();
    return res.status(201).json(result);
});

module.exports = blogRouter;
