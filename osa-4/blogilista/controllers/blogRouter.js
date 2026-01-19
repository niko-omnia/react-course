const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get('/api/blogs', (req, res) => {    
    Blog.find({}).then((blogs) => {
        return res.json(blogs);
    });
});

blogRouter.post('/api/blogs', (req, res) => {
    const blog = new Blog(request.body);

    blog.save().then((result) => {
        return res.status(201).json(result);
    });
});

module.exports = blogRouter;
