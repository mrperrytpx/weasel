import { useInfiniteQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "@weasel/types";

const fetchAlbums = async (pageParam: number) => {
    const response = await apiInstance.get<TAlbum[]>(
        `/api/albums?offset=${pageParam ? pageParam : 0}`,
    );

    return response.data;
};

const ALBUM_OFFSET = 20;

export const useGetAllAlbumsInfQuery = () => {
    const user = useUser();

    return useInfiniteQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: async ({ pageParam = 0 }) => fetchAlbums(pageParam),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length >= ALBUM_OFFSET ? pages.flat().length : undefined;
        },
    });
};
