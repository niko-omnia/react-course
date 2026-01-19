const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Blog = require("../models/blog");
const User = require("../models/user");

function getTokenFromRequest(request) {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

async function getUserFromRequest(req) {
    const decodedToken = jwt.verify(getTokenFromRequest(req), process.env.JWT_SECRET)
    if (!decodedToken.id) return null;
    return await User.findById(decodedToken.id) || null;
}

blogRouter.get('/api/blogs', async (req, res) => {   
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });

    const formattedBlogs = blogs.map(blog => ({
        id: blog._id,
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
        user: blog.user ? {
            id: blog.user._id,
            username: blog.user.username,
            name: blog.user.name
        } : null
    }));

    return res.json(formattedBlogs);
});

blogRouter.post('/api/blogs', async (req, res) => {
    if (!req.body.title || !req.body.url) return res.sendStatus(400);

    const user = await getUserFromRequest(req);

    if (!user) {
        return res.status(400).json({ error: 'UserId missing or not valid' })
    }
    
    const blogData = {
        title: req.body.title,
        author: req.body.author || "",
        url: req.body.url,
        likes: req.body.likes || 0,
        user: user._id
    };

    const blog = new Blog(blogData);
    const result = await blog.save();

    const populatedResult = await Blog.findById(result._id).populate('user', { username: 1, name: 1 });

    return res.status(201).json(populatedResult);
});

blogRouter.patch("/api/blogs/:id", async (req, res) => {
    const blogId = req.params.id || null;
    if (!blogId) return res.sendStatus(400);

    const { likes } = req.body;
    if (!likes) return res.sendStatus(400);

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { likes },
        { new: true, runValidators: true }
    );

    if (updatedBlog) return res.status(200).json(updatedBlog);
    return res.sendStatus(404);
});

blogRouter.delete('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id || null;
    if (!blogId) return res.sendStatus(400);

    const result = await Blog.findByIdAndDelete(blogId);
    if (result) return res.sendStatus(204);
    return res.sendStatus(404);
});

module.exports = blogRouter;
