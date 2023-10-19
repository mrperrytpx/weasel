import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TProfileStats } from "@weasel/types";

const fetchProfileStats = async () => {
    const response = await apiInstance.get<TProfileStats>("/api/profile");
    return response.data;
};

export const useGetProfileStatsQuery = () => {
    const user = useUser();

    return useQuery({
        queryKey: ["profile-stats", user?.data?.id],
        queryFn: fetchProfileStats,
        enabled: !!user?.data?.id,
    });
};
