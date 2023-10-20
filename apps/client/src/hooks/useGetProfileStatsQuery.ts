import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TProfileStats } from "@weasel/types";

export const useGetProfileStatsQuery = () => {
    const user = useUser();

    const fetchProfileStats = async () => {
        const response = await apiInstance.get<TProfileStats>("/api/profile");

        return response.data;
    };

    return useQuery({
        queryKey: ["profile-stats", user?.data?.id],
        queryFn: fetchProfileStats,
        enabled: !!user?.data?.id,
    });
};
