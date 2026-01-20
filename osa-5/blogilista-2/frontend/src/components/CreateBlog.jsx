import blogService from "../services/blogs";

export default function CreateBlog() {
    return (
        <div>
            <h2>Create New Blog</h2>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent location change

                // Get submitted form data
                const formData = new FormData(e.target);
                let data = Object.fromEntries(formData.entries());

                if (!data.title || !data.author || !data.url) {
                    alert("Please fill all the fields before logging in!");
                    return;
                }

                const response = await blogService.createBlog({
                    title: data.title,
                    author: data.author,
                    url: data.url
                });

                if (response && response.id) {
                    alert("Blog created!");
                    window.location.reload();
                } else {
                    alert("Failed to create blog!");
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
