import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { LoadingSpinner } from "../components/LoadingSpinner";

type TProtectedRouteProps = {
    children: React.ReactElement | React.ReactElement[];
};

export const ProtectedRoute = ({ children }: TProtectedRouteProps) => {
    const user = useUser();

    if (user?.isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <LoadingSpinner size={60} />;
            </div>
        );
    }

    if (!user?.data?.id) {
        return <Navigate to="/sign-in" />;
    }

    return children;
};
