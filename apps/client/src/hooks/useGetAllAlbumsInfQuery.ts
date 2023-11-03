import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TInfiniteAlbums } from "@weasel/types";

const fetchAlbums = async (pageParam: number) => {
    const response = await apiInstance.get<TInfiniteAlbums>(`/api/albums?cursor=${pageParam}`);

    return response.data;
};

export const useGetAllAlbumsInfQuery = () => {
    const user = useUser();

    return useInfiniteQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: async ({ pageParam = 0 }) => fetchAlbums(pageParam),
        getNextPageParam: (lastPage) => {
            return lastPage.albums[lastPage.albums.length - 1]
                ? lastPage.albums[lastPage.albums.length - 1].id
                : undefined;
        },
    });
};
