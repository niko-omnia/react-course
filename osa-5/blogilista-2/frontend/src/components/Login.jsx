import authService from "../services/auth";

export default function Login() {
    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={async (e) => {
                e.preventDefault(); // Prevent location change

                // Get submitted form data
                const formData = new FormData(e.target);
                let data = Object.fromEntries(formData.entries());

                if (!data.username || !data.password) {
                    alert("Please fill all the fields before logging in!");
                    return;
                }

                const response = await authService.login(data.username, data.password);
                if (response && response.id && response.token) {
                    window.location.reload();
                } else {
                    alert("Failed to login!");
                }
            }}>
                <input required name="username" type="text" minLength={3} placeholder="username" autoComplete="username"></input>
                <input required name="password" type="password" minLength={3} placeholder="password" autoComplete="current-password"></input>
                <input type="submit" value="Login"></input>
            </form>
        </div>
    )
}
