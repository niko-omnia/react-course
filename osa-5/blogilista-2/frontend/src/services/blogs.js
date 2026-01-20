import axios from 'axios';

async function getBlogs() {
  const request = await axios.get("/api/blogs");
  return request.data;
}

async function createBlog(data) {
  const request = await axios.post("/api/blogs", data);
  return request.data;
}

async function updateLikes(blogId, likes) {
  const request = await axios.patch(`/api/blogs/${blogId}`, { likes });
  return request.data;
}

export default { getBlogs, createBlog, updateLikes };
