import { useInfiniteQuery } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TInfiniteImages } from "@weasel/types";

export const useGetAlbumImagesInfQuery = (albumId: string) => {
    const fetchImages = async (albumId: string, pageParam: string) => {
        const response = await apiInstance.get<TInfiniteImages>(
            `/api/images/${albumId}?cursorId=${pageParam}`,
        );

        return response.data;
    };

    return useInfiniteQuery({
        queryKey: ["images", albumId],
        queryFn: async ({ pageParam = 0 }) => fetchImages(albumId, pageParam),
        enabled: !!albumId,
        staleTime: 1000,
        keepPreviousData: true,
        getNextPageParam: (lastPage, pages) => {
            const totalFetchedImages = pages.reduce(
                (acc, curr) => acc + curr.images.length || 0,
                0,
            );
            if (totalFetchedImages >= lastPage.count) {
                return undefined;
            }

            return lastPage.images[lastPage.images.length - 1]?.id;
        },
    });
};
