const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Blog = require('../models/blog');

usersRouter.post('/api/users', async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
        return res.status(400).json({ error: "username, name, & password is required!" });
    }
    if (username.length < 3 || password.length < 3) {
        return res.status(400).json({ error: "username & password have a minimum length of (3)!" });
    }

    const result = await User.findOne({ username });
    if (result) return res.status(400).json({ error: "Username is already in use!" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        name,
        passwordHash,
    });

    const savedUser = await user.save();
    return res.status(201).json(savedUser);
});

usersRouter.get('/api/users', async (req, res) => {
    const users = await User.find({});

    const usersWithBlogs = await Promise.all(
        users.map(async (user) => {
            const blogs = await Blog.find({ user: user._id }).populate('user', { username: 1, name: 1 });
            
            const final_blogs = blogs.map(blog => ({
                title: blog.title,
                author: blog.author,
                url: blog.url,
                likes: blog.likes,
                id: blog._id
            }));

            return {
                username: user.username,
                name: user.name,
                id: user._id,
                blogs: final_blogs
            };
        })
    );

    return res.json(usersWithBlogs);
});

module.exports = usersRouter;
