import axios from 'axios';

async function getBlogs() {
  const request = await axios.get("/api/blogs");
  return request.data;
}

export default { getBlogs };
