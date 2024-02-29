import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
// import SignInPage from "./pages/SignInPage";
import AlbumsPage from "./pages/AlbumsPage";
import AlbumPage from "./pages/AlbumPage";
import ProfilePage from "./pages/ProfilePage";
import CreateAlbumPage from "./pages/CreateAlbumPage";
import AlbumRoutesLayout from "./layouts/AlbumRoutesLayout";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { useUser } from "./hooks/useUser";
import TosPage from "./pages/TosPage";
import ContactPage from "./pages/ContactPage";
import PrivacyPage from "./pages/PrivacyPage";
import PublicAlbumPage from "./pages/PublicAlbumPage";
import { ProfileOverview } from "./components/ProfileOverview";
import { ProfileFiles } from "./components/ProfileFiles";
import { ProfileBilling } from "./components/ProfileBilling";
import { ProfileSettings } from "./components/ProfileSettings";
import { lazy } from "react";

const SignInPage = lazy(() => import("./pages/SignInPage"));

function App() {
    const user = useUser();

    return (
        <>
            <Navbar />

            <Routes>
                <Route index element={<HomePage />} />
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
                >
                    <Route index element={<ProfileOverview />} />
                    <Route path="files" element={<ProfileFiles />} />
                    <Route path="billing" element={<ProfileBilling />} />
                    <Route path="settings" element={<ProfileSettings />} />
                </Route>

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
