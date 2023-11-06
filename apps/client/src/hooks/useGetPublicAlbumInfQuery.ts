import { useInfiniteQuery } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "@weasel/types";

const fetchPublicAlbum = async (albumId: string, pageParam: number) => {
    const response = await apiInstance.get<TAlbum>(
        `/api/albums/public/${albumId}?offset=${pageParam}`,
    );

    return response.data;
};

export const useGetPublicAlbumQuery = (albumId: string) => {
    return useInfiniteQuery({
        queryKey: ["public-album", albumId],
        queryFn: ({ pageParam = 0 }) => fetchPublicAlbum(albumId, pageParam),
        enabled: !!albumId,
        getNextPageParam: (lastPage, pages) => {
            const totalFetchedAlbums = pages.reduce((acc, curr) => acc + curr.images.length, 0);

            if (totalFetchedAlbums >= lastPage._count.images) {
                return undefined;
            }

            return totalFetchedAlbums ?? undefined;
        },
    });
};
