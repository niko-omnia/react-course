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

module.exports = { dummy, totalLikes, favouriteBlog };
