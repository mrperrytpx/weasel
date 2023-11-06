import { useInfiniteQuery } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TInfiniteFiles } from "@weasel/types";

const fetchAlbums = async (pageParam: string) => {
    const response = await apiInstance.get<TInfiniteFiles>(`/api/images?cursorId=${pageParam}`);

    return response.data;
};

export const useGetFilesInfQuery = () => {
    const user = useUser();

    return useInfiniteQuery({
        queryKey: ["all-files", user?.data?.id],
        queryFn: ({ pageParam = 0 }) => fetchAlbums(pageParam),
        getNextPageParam: (lastPage) => {
            if (!lastPage.nextId) return undefined;

            return lastPage.nextId;
        },
    });
};
