import { useState } from "react";

import blogService from "../services/blogs";
import Notification from "./Notification";

export default function CreateBlog({ setVisible, updateBlogs, setNotification }) {
    return (
        <div>
            <h2>Create Blog</h2>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent location change

                // Get submitted form data
                const formData = new FormData(e.target);
                let data = Object.fromEntries(formData.entries());

                if (!data.title || !data.author || !data.url) {
                    setNotification("Please fill all the fields before logging in!");
                    return;
                }

                try {
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
                } catch (response) {
                    setNotification(
                        response && response.response && response.response.data && response.response.data.error
                        ? response.response.data.error
                        : "Failed to create blog!"
                    );
                }
                setVisible(false);
            }}>
                <input required name="title" type="text" placeholder="Title"></input>
                <input required name="author" type="text" placeholder="Author"></input>
                <input required name="url" type="text" placeholder="URL"></input>
                <input type="submit" value="Create"></input>
                <button onClick={() => { setVisible(false); }}>Cancel</button>
            </form>
        </div>
    )
}
