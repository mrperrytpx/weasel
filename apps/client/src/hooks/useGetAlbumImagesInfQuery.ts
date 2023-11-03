import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { Image, TAlbum, TInfiniteAlbums } from "@weasel/types";

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
            const allAlbums: InfiniteData<TInfiniteAlbums> | undefined = queryClient.getQueryData([
                "albums",
                user?.data?.id,
            ]);

            if (!allAlbums) return;

            const album = allAlbums.pages.reduce<TAlbum | null>((result, page) => {
                const target = page.albums.find((album) => album.id === albumId);
                if (target) return target;
                return result;
            }, null);

            if (!album) return;
            if (!album.images.length) return;

            return {
                pageParams: [0],
                pages: [[...album.images]],
            };
        },
    });
};
