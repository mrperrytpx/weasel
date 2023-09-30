function App() {
    const googleLogin = () => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, "_self");
    };

    return (
        <div className="mx-auto mb-2 mt-4 flex w-full max-w-screen-md flex-col items-start gap-2 px-2 lg:gap-6">
            <p>Server data is below me:</p>
            <div
                className="cursor-pointer rounded-md bg-slate-100 p-2 shadow-md"
                onClick={googleLogin}
            >
                <img
                    src="https://raw.githubusercontent.com/mrperrytpx/garbgarb/main/public/static/default.png"
                    alt="Google Icon"
                />
                <p>Login With Google</p>
            </div>
        </div>
    );
}

export default App;
