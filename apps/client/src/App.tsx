import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";
import ProfilePage from "./pages/ProfilePage";
import CreateAlbumPage from "./pages/CreateAlbumPage";
import AlbumRoutesLayout from "./components/AlbumRoutesLayout";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { useUser } from "./hooks/useUser";
import TosPage from "./pages/TosPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import PublicAlbumPage from "./pages/PublicAlbumPage";

function App() {
    const user = useUser();

    return (
        <>
            <Navbar />

            <Routes>
                <Route index path="/" element={<HomePage />} />
                <Route path="/tos" element={<TosPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/public-album/:albumId" element={<PublicAlbumPage />} />
                <Route
                    path="/sign-in"
                    element={user?.data?.id ? <Navigate to="/albums" /> : <SignInPage />}
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/albums/create"
                    element={
                        <ProtectedRoute>
                            <CreateAlbumPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/albums"
                    element={
                        <ProtectedRoute>
                            <AlbumRoutesLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={
                            <ProtectedRoute>
                                <AlbumsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path=":albumId"
                        element={
                            <ProtectedRoute>
                                <AlbumPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </>
    );
}

export default App;
