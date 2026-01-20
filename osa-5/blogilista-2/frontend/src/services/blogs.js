import axios from 'axios';

async function getBlogs() {
  const request = await axios.get("/api/blogs");
  return request.data;
}

async function createBlog(data) {
  const request = await axios.post("/api/blogs", data);
  return request.data;
}

export default { getBlogs, createBlog };
