import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum, TInfiniteAlbums } from "@weasel/types";
import { useUser } from "./useUser";

export const useGetAlbumQuery = (albumId: string) => {
    const queryClient = useQueryClient();
    const user = useUser();

    const fetchAlbum = async () => {
        queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
            ["albums", user?.data?.id],
            (oldData) => {
                const album = queryClient.getQueryData<TAlbum>(["album", albumId]);

                if (!album) {
                    return oldData;
                }

                if (!oldData) {
                    return {
                        pageParams: [0],
                        pages: [{ albums: [album], count: Infinity }],
                    };
                }

                if (oldData.pages[0].albums[0].id === album.id) {
                    return oldData;
                }

                const newPages = oldData.pages
                    .map((page, idx) => {
                        if (idx === 0) {
                            return {
                                albums: [
                                    album,
                                    ...page.albums.filter((album) => album.id !== albumId),
                                ],
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

        if (!response.data) return;

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
