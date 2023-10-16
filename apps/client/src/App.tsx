import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useUser } from "./hooks/useUser";
import SignInPage from "./pages/SignInPage";
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
                    path="/sign-in"
                    element={user?.data?.id ? <Navigate to="/albums" /> : <SignInPage />}
                />
                <Route
                    path="/profile"
                    element={user?.data?.id ? <ProfilePage /> : <Navigate to="/sign-in" />}
                />

                <Route
                    path="/albums/create"
                    element={user?.data?.id ? <CreateAlbumPage /> : <Navigate to="/sign-in" />}
                />

                <Route path="/albums" element={<AlbumRoutesLayout />}>
                    <Route
                        index
                        element={user?.data?.id ? <AlbumsPage /> : <Navigate to="/sign-in" />}
                    />
                    <Route
                        path=":albumId"
                        element={user?.data?.id ? <AlbumPage /> : <Navigate to="/sign-in" />}
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
