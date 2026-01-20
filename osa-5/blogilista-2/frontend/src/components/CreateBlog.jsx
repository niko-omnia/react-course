import { useState } from "react";

import blogService from "../services/blogs";
import Notification from "./Notification";

export default function CreateBlog({ updateBlogs }) {
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
    
    return (
        <div>
            <h2>Create New Blog</h2>
            <Notification text={notificationText} />
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent location change

                // Get submitted form data
                const formData = new FormData(e.target);
                let data = Object.fromEntries(formData.entries());

                if (!data.title || !data.author || !data.url) {
                    setNotification("Please fill all the fields before logging in!");
                    return;
                }

                const response = await blogService.createBlog({
                    title: data.title,
                    author: data.author,
                    url: data.url
                });

                if (response && response.id) {
                    setNotification(`New blog "${data.title}" by ${data.author} was added!`);
                    await updateBlogs();
                } else {
                    setNotification("Failed to create blog!");
                }
            }}>
                <input required name="title" type="text" placeholder="Title"></input>
                <input required name="author" type="text" placeholder="Author"></input>
                <input required name="url" type="text" placeholder="URL"></input>
                <input type="submit" value="Create"></input>
            </form>
        </div>
    )
}
