const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get('/api/blogs', async (req, res) => {   
    const blogs = await Blog.find({});
    return res.json(blogs);
});

blogRouter.post('/api/blogs', async (req, res) => {
    if (!req.body.title || !req.body.url) return res.sendStatus(400);

    const blogData = {
        title: req.body.title,
        author: req.body.author || "",
        url: req.body.url,
        likes: req.body.likes || 0,
    };
    const blog = new Blog(blogData);
    const result = await blog.save();

    return res.status(201).json(result);
});

module.exports = blogRouter;
