const { test, describe, beforeEach, after } = require('node:test');
const supertest = require('supertest');
const assert = require('node:assert');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const config = require('../utils/config');

const api = supertest(app);

describe('API tests', () => {
    const initialBlogs = [
        {
            "title": "Something",
            "author": "Someone",
            "url": "https://google.com",
            "likes": 0
        },
        {
            "title": "Something else",
            "author": "Someone",
            "url": "https://google.com",
            "likes": 6
        },
        {
            "title": "Something 123",
            "author": "Someone else",
            "url": "https://google.com",
            "likes": 3
        }
    ];

    beforeEach(async () => {
        await mongoose.connect(config.MONGODB_URI);
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);
    });

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test('all blogs have an id', async () => {
        const response = await api.get('/api/blogs');
        for (const blog of response.body) {    
            assert.ok(blog.id && blog.id.length > 0);
        }
    });

    test('blog add success', async () => {
        const newBlog = {
            title: "New blog",
            author: "Nobody knows",
            url: "https://github.com",
            likes: 0
        };

        const response = await api.post("/api/blogs").send(newBlog);
        assert.strictEqual(response.ok, true, "Failed to create new item!");

        const response2 = await api.get("/api/blogs");
        assert.strictEqual(response2.body.length, initialBlogs.length + 1, "New blog was not created");

        const addedBlog = await Blog.findOne({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            likes: newBlog.likes
        });
        assert.ok(addedBlog, 'Blog was not saved with exact data');

        await addedBlog.deleteOne();
    });

    test('blog with null likes given is set to 0 likes', async () => {
        const newBlog = {
            title: "New blog",
            author: "Nobody knows",
            url: "https://github.com"
        };

        const response = await api.post("/api/blogs").send(newBlog);
        assert.strictEqual(response.ok, true, "Failed to create new item!");

        const response2 = await api.get("/api/blogs");
        assert.strictEqual(response2.body.length, initialBlogs.length + 1, "New blog was not created");

        const addedBlog = await Blog.findOne({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            likes: 0
        });
        assert.ok(addedBlog, 'Blog was not added');

        await addedBlog.deleteOne();
    });

    test('bad blog creation request receives status 400', async () => {
        const newBlog = {
            author: "someone",
            likes: 999
        };
        const response = await api.post("/api/blogs").send(newBlog);
        assert.strictEqual(response.status, 400);
    });

    after(async () => {
        await mongoose.connection.close();
    });
});
