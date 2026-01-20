import { useState, useEffect } from 'react';

import blogService from './services/blogs';
import authService from './services/auth';

import CreateBlog from './components/CreateBlog';
import Blog from './components/Blog';
import Login from './components/Login';

import { getLocalData, setLocalData } from './assets/simpleStorage';

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const [blogs, setBlogs] = useState([]);

  async function fetchUserInfo() {
    const userInfo = await authService.getUserInfo();
    if (userInfo && userInfo.id) {
      setUserInfo(userInfo);
      setLocalData("auth", userInfo);
      return;
    }
    setUserInfo({ id: null });
    setLocalData("auth", null);
  }
  
  async function getBlogs() {
    const blogs = await blogService.getBlogs();
    if (blogs && blogs.length > 0) setBlogs(blogs);
  }

  useEffect(() => {
    fetchUserInfo();
    getBlogs();
  }, []);

  if (userInfo.id === null) {
    return (
      <div>
        <Login />
      </div>
    );
  }

  if (!userInfo.id) return null;
  return (
    <div>
      <h2>blogs</h2>
      <p>{userInfo.name} logged in <button onClick={async () => {
        await authService.logout();
        window.location.reload();
      }}>Logout</button></p>
      
      <CreateBlog />

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
