import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { createContext } from "react";
import { apiInstance } from "../utils/axiosClients";

export type TUser = {
    id: string;
    image: string;
};

export const UserContext = createContext<UseQueryResult<TUser, unknown> | null>(null);

type TUserContextProps = {
    children: React.ReactElement | React.ReactElement[];
};

export const UserContextProvider = ({ children }: TUserContextProps) => {
    const userQuery = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const data = await apiInstance.get<TUser>("/api/auth/user");
            // console.log("data", data);
            return data.data;
        },
    });

    return <UserContext.Provider value={userQuery}>{children}</UserContext.Provider>;
};
