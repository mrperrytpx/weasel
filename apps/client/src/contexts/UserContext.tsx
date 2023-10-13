import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { apiInstance } from "../utils/axiosClients";
import { TUser } from "@weasel/types";

export const UserContext = createContext<UseQueryResult<TUser, unknown> | null>(null);

type TUserContextProps = {
    children: React.ReactElement | React.ReactElement[];
};

export const UserContextProvider = ({ children }: TUserContextProps) => {
    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const data = await apiInstance.get<TUser>("/api/auth/user");
            return data.data;
        },
        refetchOnReconnect: true,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });

    return <UserContext.Provider value={userQuery}>{children}</UserContext.Provider>;
};
