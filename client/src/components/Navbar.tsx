import { Link } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useTheme } from "../hooks/useTheme";
import { BsMoonStars, BsSun } from "react-icons/bs";

export const Navbar = () => {
    const user = useUser();
    const { toggleTheme, darkmode } = useTheme();

    return (
        <div>
            <div className="flex max-w-screen-xl items-center justify-between bg-red-200 p-4">
                <Link to="/">LOGO</Link>
                <ul className="flex items-center gap-20 bg-white">
                    <li>
                        {user?.data?.id ? (
                            <Link to="/profile">Profile</Link>
                        ) : (
                            <Link to="/login">Login</Link>
                        )}
                    </li>
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
