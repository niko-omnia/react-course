import axios from 'axios';

async function getBlogs() {
  const request = await axios.get("/api/blogs");
  return request.data;
}

async function createBlog(data) {
  const request = await axios.post("/api/blogs", data);
  return request.data;
}

async function deleteBlog(id) {
  const request = await axios.delete(`/api/blogs/${id}`);
  return request.status === 204;
}

async function updateLikes(blogId, likes) {
  const request = await axios.patch(`/api/blogs/${blogId}`, { likes });
  return request.data;
}

export default { getBlogs, createBlog, deleteBlog, updateLikes };
