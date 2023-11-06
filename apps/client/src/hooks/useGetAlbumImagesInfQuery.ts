import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TAlbum, TInfiniteAlbums, TInfiniteImages } from "@weasel/types";

const fetchImages = async (albumId: string, pageParam: string) => {
    const response = await apiInstance.get<TInfiniteImages>(
        `/api/images/${albumId}?cursorId=${pageParam}`,
    );

    return response.data;
};

export const useGetAlbumImagesInfQuery = (albumId: string) => {
    const user = useUser();
    const queryClient = useQueryClient();

    return useInfiniteQuery({
        queryKey: ["images", albumId],
        queryFn: async ({ pageParam = 0 }) => fetchImages(albumId, pageParam),
        enabled: !!albumId,
        getNextPageParam: (lastPage, pages) => {
            const totalFetchedImages = pages.reduce((acc, curr) => acc + curr.images.length, 0);
            if (totalFetchedImages >= lastPage.count) {
                return undefined;
            }

            if (lastPage.images[lastPage.images.length - 1]) {
                return lastPage.images[lastPage.images.length - 1].id;
            }

            return undefined;
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
            if (!album._count?.images) return;

            return {
                pageParams: [0],
                pages: [
                    {
                        images: [...album.images],
                        count: album._count.images,
                    },
                ],
            };
        },
    });
};
