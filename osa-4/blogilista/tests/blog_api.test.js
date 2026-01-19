const { test, describe, beforeEach, after } = require('node:test');
const supertest = require('supertest');
const assert = require('node:assert');
const mongoose = require('mongoose');

const app = require('../app');
const Blog = require('../models/blog');
const config = require('../utils/config');

const api = supertest(app);

async function createBlog(data) {
    return await api.post("/api/blogs").send(data);
}
async function getBlogs() {
    return await api.get("/api/blogs");
}
async function findBlog(data) {
    return await Blog.findOne(data);
}
async function editBlog(id, data) {
    return await api.patch(`/api/blogs/${id}`).send(data);
}
async function deleteBlogById(id) {
    return await api.delete(`/api/blogs/${id}`);
}
async function deleteBlog(blog) {
    return await blog.deleteOne();
}

describe('API tests - Blogs', () => {
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
    });

    test('all blogs are returned', async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(initialBlogs);

        const response = await getBlogs();
        assert.strictEqual(response.body.length, initialBlogs.length);
    });

    test('all blogs have an id', async () => {
        const response = await getBlogs();
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

        const response = await createBlog(newBlog);
        assert.strictEqual(response.ok, true, "Failed to create new item!");

        const response2 = await getBlogs();
        assert.strictEqual(response2.body.length, initialBlogs.length + 1, "New blog was not created");

        const addedBlog = await findBlog(newBlog);
        assert.ok(addedBlog, 'Blog was not saved with exact data');

        await deleteBlog(addedBlog);
    });

    test('blog with null likes given is set to 0 likes', async () => {
        const newBlog = {
            title: "New blog",
            author: "Nobody knows",
            url: "https://github.com"
        };

        const response = await createBlog(newBlog);
        assert.strictEqual(response.ok, true, "Failed to create new item!");

        const response2 = await getBlogs();
        assert.strictEqual(response2.body.length, initialBlogs.length + 1, "New blog was not created");

        const addedBlog = await findBlog({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            likes: 0
        });
        assert.ok(addedBlog, 'Blog was not added');

        test('blog edit works', async () => {
            const response = await editBlog(addedBlog._id, {
                likes: 10
            });
            assert.strictEqual(response.status, 200);
            assert.ok(response.body, "blog was not updated");
            assert.ok(response.body.likes && response.body.likes === 10, "likes do not match to expected value when updated");
        });

        test('blog deletion works', async () => {
            const response = await deleteBlogById(addedBlog._id);
            assert.strictEqual(response.status, 204);
        });
    });

    test('bad blog creation request receives status 400', async () => {
        const response = await createBlog({
            author: "someone",
            likes: 999
        });
        assert.strictEqual(response.status, 400);
    });

    after(async () => {
        await mongoose.connection.close();
    });
});
