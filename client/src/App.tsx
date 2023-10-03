import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useUser } from "./hooks/useUser";
import LoginPage from "./pages/LoginPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar } from "./components/Navbar";
import CreateAlbumPage from "./pages/CreateAlbumPage";
import AlbumRoutesLayout from "./components/AlbumRoutesLayout";

function App() {
    const user = useUser();

    return (
        <>
            <Navbar />
            <Routes>
                <Route index path="/" element={<HomePage />} />
                <Route
                    path="/login"
                    element={user?.data?.id ? <Navigate to="/albums" /> : <LoginPage />}
                />
                <Route
                    path="/profile"
                    element={user?.data?.id ? <ProfilePage /> : <Navigate to="/login" />}
                />

                <Route
                    path="/albums/create"
                    element={user?.data?.id ? <CreateAlbumPage /> : <Navigate to="/login" />}
                />

                <Route path="/albums" element={<AlbumRoutesLayout />}>
                    <Route
                        index
                        element={user?.data?.id ? <AlbumsPage /> : <Navigate to="/login" />}
                    />
                    <Route
                        path=":albumId"
                        element={user?.data?.id ? <AlbumPage /> : <Navigate to="/login" />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
