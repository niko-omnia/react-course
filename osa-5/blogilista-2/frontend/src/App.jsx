import { useState, useEffect } from 'react';

import blogService from './services/blogs';
import authService from './services/auth';

import CreateBlog from './components/CreateBlog';
import Blog from './components/Blog';
import Login from './components/Login';
import Notification from './components/Notification';

import "./assets/main.css";

import { setLocalData } from './assets/simpleStorage';

const App = () => {
  const [userInfo, setUserInfo] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [createBlogVisible, setCreteBlogVisible] = useState(false);

  const [notificationText, setNotificationText] = useState("");
  const [currentTimeout, setCurrentTimeout] = useState(null);

  function setNotification(text) {
      if (currentTimeout) {
          clearTimeout(currentTimeout);
          setCurrentTimeout(null);
      }

      setNotificationText(text);
      const createdTimeout = setTimeout(() => {
          setNotificationText("");
      }, 5000);
      setCurrentTimeout(createdTimeout);
  }

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

  async function updateLikes(blog, likes) {
    try {
      const response = await blogService.updateLikes(blog.id, likes + 1);
      if (response && response.likes) return response.likes;
    } catch (e) {}
    return likes;
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
    <div className="main">
      <h2>blogs</h2>
      <Notification text={notificationText} />
      <p>{userInfo.name} logged in <button onClick={async () => {
        await authService.logout();
        window.location.reload();
      }}>Logout</button></p>
      
      {
        !createBlogVisible
        ? <button onClick={() => { setCreteBlogVisible(true) }}>Create New Blog</button>
        : <CreateBlog setVisible={setCreteBlogVisible} updateBlogs={getBlogs} setNotification={setNotification} />
      }
      
      {blogs.sort((first, second) => first.likes < second.likes).map(blog => (
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} />
      ))}
    </div>
  );
}

export default App;
