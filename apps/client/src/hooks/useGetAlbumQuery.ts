import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { Image, TAlbum, TInfiniteAlbums } from "@weasel/types";
import { useUser } from "./useUser";

const IMAGE_OFFSET = 20;

export const useGetAlbumQuery = (albumId: string) => {
    const queryClient = useQueryClient();
    const user = useUser();

    const fetchAlbum = async () => {
        queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
            ["albums", user?.data?.id],
            (oldData) => {
                if (!oldData) {
                    return {
                        pageParams: [0],
                        pages: [{ albums: [response.data], count: Infinity }],
                    };
                }

                const album = queryClient.getQueryData<TAlbum>(["album", albumId]);

                if (!album) {
                    return oldData;
                }

                if (oldData.pages[0].albums[0].id === album.id) {
                    return oldData;
                }

                const newPages = oldData.pages
                    .map((page, idx) => {
                        if (idx === 0) {
                            return {
                                albums: [album, ...page.albums],
                                count: page.count,
                            } satisfies typeof page;
                        }

                        return {
                            albums: page.albums.filter((album) => album.id !== albumId),
                            count: page.count,
                        } satisfies typeof page;
                    })
                    .filter((page) => page.albums.length);

                return {
                    pageParams: oldData.pageParams,
                    pages: newPages,
                };
            },
        );

        const response = await apiInstance.get<TAlbum>(`/api/albums/${albumId}`);

        queryClient.setQueryData<InfiniteData<Image[]>>(["images", albumId], () => {
            return {
                pageParams:
                    response.data.images.length >= IMAGE_OFFSET
                        ? [response.data.images.length]
                        : [0],
                pages: [response.data.images],
            };
        });

        return response.data;
    };

    return useQuery({
        queryKey: ["album", albumId],
        queryFn: fetchAlbum,
        initialData: () => {
            const allAlbums = queryClient.getQueryData<InfiniteData<TInfiniteAlbums>>([
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

            return album;
        },
    });
};
