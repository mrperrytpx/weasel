import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { apiInstance } from "../utils/axiosClients";
import { TUser } from "@weasel/types";

export const UserContext = createContext<UseQueryResult<TUser | null, unknown> | null>(null);

type TUserContextProps = {
    children: React.ReactElement | React.ReactElement[];
};

export const UserContextProvider = ({ children }: TUserContextProps) => {
    const fetchUser = async () => {
        console.log("what");
        try {
            const response = await apiInstance.get<TUser>("/api/auth/user");
            console.log("resp", response);

            return response.data;
        } catch (e) {
            return null;
        }
    };

    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });

    return <UserContext.Provider value={userQuery}>{children}</UserContext.Provider>;
};
