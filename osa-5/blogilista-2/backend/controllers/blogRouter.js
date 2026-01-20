const blogRouter = require("express").Router();
const Blog = require("../models/blog");

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
    if (!req.token) return res.status(401).json({ error: "token missing or invalid" });
    if (!req.user || !req.user._id) return res.status(400).json({ error: 'invalid user' });
    if (!req.body.title || !req.body.url) return res.sendStatus(400);
    
    const blogData = {
        title: req.body.title,
        author: req.body.author || "",
        url: req.body.url,
        likes: req.body.likes || 0,
        user: req.user._id
    };

    const blog = new Blog(blogData);
    const result = await blog.save();

    const populatedResult = await Blog.findById(result._id).populate('user', { username: 1, name: 1 });

    return res.status(201).json(populatedResult);
});

blogRouter.patch("/api/blogs/:id", async (req, res) => {
    if (!req.token) return res.status(401).json({ error: "token missing or invalid" });
    if (!req.user || !req.user._id) return res.status(401).json({ error: 'invalid user' });

    const { likes } = req.body;
    if (likes === undefined) return res.status(400).json({ error: "Likes missing" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog does not exist!" });

    if (!blog.user.equals(req.user._id)) {
        return res.status(401).json({ error: "You do not have permission to edit this blog!" });
    }

    blog.likes = likes;
    const updatedBlog = await blog.save();
    
    return res.status(200).json(updatedBlog);
});

blogRouter.delete('/api/blogs/:id', async (req, res) => {
    if (!req.token) return res.status(401).json({ error: "token missing or invalid" });
    if (!req.user || !req.user._id) return res.status(400).json({ error: 'invalid user' });
    
    const blogId = req.params.id || null;
    if (!blogId) return res.sendStatus(400);

    const blogData = await Blog.findOne({ _id: blogId });

    if (!blogData) return res.status(404).json({ error: "Blog does not exist or has already been removed." });
    if (!blogData.user.equals(req.user._id)) return res.status(401).json({ error: "You do not have permissions to remove this blog!" });

    const result = await Blog.findByIdAndDelete(blogId);
    if (result) return res.sendStatus(204);
    return res.sendStatus(404);
});

module.exports = blogRouter;
