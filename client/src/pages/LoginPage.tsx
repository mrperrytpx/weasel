const LoginPage = () => {
    const googleLogin = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, "_self");
    };

    return (
        <div>
            <p>Login Page</p>
            <button onClick={googleLogin}>Login with google</button>
        </div>
    );
};

export default LoginPage;
