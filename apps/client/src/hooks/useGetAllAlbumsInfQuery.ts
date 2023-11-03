import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TInfiniteAlbums } from "@weasel/types";

export const useGetAllAlbumsInfQuery = () => {
    const user = useUser();

    const fetchAlbums = async (pageParam: string) => {
        const response = await apiInstance.get<TInfiniteAlbums>(
            `/api/albums?cursorId=${pageParam}`,
        );

        return response.data;
    };

    return useInfiniteQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: async ({ pageParam = 0 }) => fetchAlbums(pageParam),
        getNextPageParam: (lastPage, pages) => {
            const totalFetchedAlbums = pages.reduce((acc, curr) => acc + curr.albums.length, 0);
            if (totalFetchedAlbums >= lastPage.count) {
                return undefined;
            }
            return lastPage.albums[lastPage.albums.length - 1]?.id;
        },
    });
};
