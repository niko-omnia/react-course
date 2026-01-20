import { useState } from "react";
import blogService from '../services/blogs';

export default function Blog({ blog }) {
  const [infoVisible, setInfoVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  return (
    <div className="blog">
      <div className="controls">
        <p>{blog.title} {blog.author}</p>
        <button onClick={() => {
          setInfoVisible(!infoVisible);
        }}>{infoVisible ? "Hide" : "View"}</button>
      </div>
      <div className="blog-info" style={{"display": infoVisible ? "flex" : "none"}}>
        <p>Url: {blog.url}</p>
        <p>Likes: {likes} <button onClick={async () => {
          try {
            const response = await blogService.updateLikes(blog.id, likes + 1);
            if (response && response.likes) setLikes(response.likes);
          } catch (e) {}
        }}>Like</button></p>
        <p>Added by: {blog.user && blog.user.name ? blog.user.name : "Not available"}</p>
      </div>
    </div>
  );
}
