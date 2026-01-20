// const blogSchema = mongoose.Schema({
//     title: String,
//     author: String,
//     url: String,
//     likes: Number,
// });

const blog = require("../models/blog");

function dummy(blogs) {
    return 1;
}

function totalLikes(blogs) {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes;
    }, 0);
}

function favouriteBlog(blogs) {
    if (!blogs || blogs.length === 0) return null;
    let favorite = blogs[0];
    for (const blog of blogs) {
        if (favorite.likes < blog.likes) favorite = blog;
    }
    return favorite;
}

function mostBlogs(blogs) {
    if (!blogs || blogs.length === 0) return null;
    let totalBlogs = {};

    for (const blog of blogs) {
        totalBlogs[blog.author] = (totalBlogs[blog.author] || 0) + 1;
    }

    let mostBlogs = null;
    Object.keys(totalBlogs).forEach((author) => {
        if (!mostBlogs || totalBlogs[author] > totalBlogs[mostBlogs]) {
            mostBlogs = author;
        }
    });
    
    return {
        author: mostBlogs,
        blogs: totalBlogs[mostBlogs]
    };
}
function mostLikes(blogs) {
    if (!blogs || blogs.length === 0) return null;
    let totalLikes = {};

    for (const blog of blogs) {
        totalLikes[blog.author] = (totalLikes[blog.author] || 0) + (blog.likes || 0);
    }

    let mostLikes = null;
    Object.keys(totalLikes).forEach((author) => {
        if (!mostLikes || totalLikes[author] > totalLikes[mostLikes]) {
            mostLikes = author;
        }
    });
    
    return {
        author: mostLikes,
        likes: totalLikes[mostLikes]
    };
}

module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
