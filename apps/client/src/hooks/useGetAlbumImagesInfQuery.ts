import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { Image, TAlbum } from "@weasel/types";

const fetchImages = async (albumId: string, pageParam: number) => {
    const response = await apiInstance.get<Image[]>(
        `/api/images/${albumId}?offset=${pageParam ? pageParam : 0}`,
    );
    return response.data;
};

const IMAGES_OFFSET = 20;

export const useGetAlbumImagesInfQuery = (albumId: string) => {
    const user = useUser();
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ["images", albumId],
        queryFn: async ({ pageParam = 0 }) => fetchImages(albumId, pageParam),
        enabled: !!albumId,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length >= IMAGES_OFFSET ? pages.flat().length : undefined;
        },
        initialData: () => {
            const allAlbums: InfiniteData<TAlbum[]> | undefined = queryClient.getQueryData([
                "albums",
                user?.data?.id,
            ]);

            if (!allAlbums) return;

            const album = allAlbums.pages.flat().find((album) => album.id === albumId);

            if (!album) return;
            if (!album.images.length) return;

            return {
                pageParams: [0],
                pages: [[...album.images]],
            };
        },
    });
};
