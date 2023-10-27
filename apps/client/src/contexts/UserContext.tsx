import { UseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext } from "react";
import { apiInstance } from "../utils/axiosClients";
import { TUser } from "@weasel/types";

export const UserContext = createContext<UseQueryResult<TUser, unknown> | null>(null);

type TUserContextProps = {
    children: React.ReactElement | React.ReactElement[];
};

export const UserContextProvider = ({ children }: TUserContextProps) => {
    const queryClient = useQueryClient();

    const fetchUser = async () => {
        const response = await apiInstance.get<TUser>("/api/auth/user");

        if (response.statusText !== "OK") {
            queryClient.clear();
        }

        return response.data;
    };

    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });

    return <UserContext.Provider value={userQuery}>{children}</UserContext.Provider>;
};
