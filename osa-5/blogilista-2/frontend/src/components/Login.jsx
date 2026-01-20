import authService from "../services/auth";
import Notification from "../components/Notification";
import { useState } from "react";

export default function Login() {
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
            <Notification text={notificationText} />

            <h1>Login</h1>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent location change

                // Get submitted form data
                const formData = new FormData(e.target);
                let data = Object.fromEntries(formData.entries());

                if (!data.username || !data.password) {
                    setNotification("Please fill all the fields before logging in!");
                    return;
                }

                try {
                    const response = await authService.login(data.username, data.password);
                    if (response && response.id && response.token) {
                        window.location.reload();
                    } else {
                        setNotification("Failed to login!");
                    }
                } catch (response) {
                    setNotification(
                        response && response.response && response.response.data && response.response.data.error
                        ? response.response.data.error
                        : "Failed to login!"
                    );
                }
            }}>
                <input required name="username" type="text" minLength={3} placeholder="username" autoComplete="username"></input>
                <input required name="password" type="password" minLength={3} placeholder="password" autoComplete="current-password"></input>
                <input type="submit" value="Login"></input>
            </form>
        </div>
    )
}
