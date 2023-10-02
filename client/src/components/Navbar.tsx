import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../hooks/useTheme";
import { BsMoonStars, BsSun } from "react-icons/bs";
import { apiInstance } from "../utils/axiosClients";
import { useQueryClient } from "@tanstack/react-query";
import WeaselImage from "../assets/weasel.png";

export const Navbar = () => {
    const user = useUser();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toggleTheme, darkmode } = useTheme();

    const logout = async () => {
        const data = await apiInstance.post("/api/auth/logout");

        if (data.statusText === "OK") {
            queryClient.removeQueries(["user"]);
            navigate(0);
        }
    };

    return (
        <div className="dark:bg-periwinkle-900 shadow-periwinkle-100 dark:shadow-periwinkle-950 bg-white p-2 shadow-md">
            <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
                <Link to="/">
                    <img
                        src={WeaselImage}
                        className="aspect-square w-8"
                        alt="A photo of a cartoonish weasel holding a black camera and resting his head on it, looking at the screen."
                    />
                </Link>
                <ul className="flex items-center gap-8">
                    <li>
                        {user?.data?.id ? (
                            <Link to="/profile">Profile</Link>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </li>
                    <li>{user?.data?.id && <button onClick={logout}>Logout!</button>}</li>
                    <li>
                        <button className="flex text-center" onClick={toggleTheme}>
                            {darkmode ? <BsSun size={20} /> : <BsMoonStars size={20} />}
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};
