import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useUser } from "./hooks/useUser";
import LoginPage from "./pages/LoginPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar } from "./components/Navbar";

function App() {
    const user = useUser();

    console.log("app user", user);

    return (
        <>
            <Navbar />
            <Routes>
                <Route index path="/" element={<HomePage />} />
                <Route
                    path="/profile"
                    element={user?.data?.id ? <ProfilePage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={user?.data?.id ? <Navigate to="/albums" /> : <LoginPage />}
                />
                <Route
                    path="/albums"
                    element={user?.data?.id ? <AlbumsPage /> : <Navigate to="/login" />}
                />
                <Route
                    path="/albums/:albumId"
                    element={user?.data?.id ? <AlbumPage /> : <Navigate to="/login" />}
                />
            </Routes>
        </>
    );
}

export default App;
