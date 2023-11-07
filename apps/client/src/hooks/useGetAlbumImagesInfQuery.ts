import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TAlbum, TInfiniteAlbums, TInfiniteFiles, TInfiniteImages, TNewImage } from "@weasel/types";

export const useGetAlbumImagesInfQuery = (albumId: string) => {
    const user = useUser();
    const queryClient = useQueryClient();

    const fetchImages = async (albumId: string, pageParam: string) => {
        const response = await apiInstance.get<TInfiniteImages>(
            `/api/images/${albumId}?cursorId=${pageParam}`,
        );

        queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
            ["albums", user?.data?.id],
            (oldData) => {
                if (!oldData) return;

                const albumInCache = oldData?.pages.reduce<TAlbum | null>((result, page) => {
                    const target = page.albums.find((album) => album.id === albumId);
                    if (target) return target;
                    return result;
                }, null);

                if (!albumInCache) return oldData;
                if (albumInCache?.images.length) return oldData;

                return {
                    pageParams: oldData?.pageParams,
                    pages: oldData?.pages.map((page) => {
                        const albumInPage = page.albums.find(
                            (album) => album.id === albumInCache.id,
                        );
                        if (albumInPage) {
                            return {
                                ...page,
                                albums: page.albums.map((album) => {
                                    if (album.id === albumInPage.id) {
                                        return {
                                            ...album,
                                            images: [response.data.images[0]],
                                        } satisfies typeof album;
                                    } else {
                                        return album;
                                    }
                                }),
                            } satisfies typeof page;
                        } else {
                            return page;
                        }
                    }),
                };
            },
        );

        return response.data;
    };

    return useInfiniteQuery({
        queryKey: ["images", albumId],
        queryFn: async ({ pageParam = 0 }) => fetchImages(albumId, pageParam),
        enabled: !!albumId,
        staleTime: Infinity,
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
        initialData: () => {
            const allFilesInCache = queryClient.getQueryData<InfiniteData<TInfiniteFiles>>([
                "all-files",
                user?.data?.id,
            ]);

            const allAlbumImages = allFilesInCache?.pages
                .map((page) => page.files)
                .flat()
                .filter((file) => file.album.id === albumId)
                .map(
                    (file) =>
                        ({
                            created_at: file.created_at,
                            id: file.id,
                            name: file.name,
                            size: file.size,
                            url: file.url,
                            album_id: file.album.id,
                            owner_id: user!.data!.id,
                        }) satisfies TNewImage,
                );

            if (allAlbumImages?.length) {
                // queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
                //     ["albums", user?.data?.id],
                //     (oldData) => {
                //         if (!oldData) return;

                //         return {
                //             pageParams: oldData.pageParams,
                //             pages: oldData.pages.map((page) => ({
                //                 ...page,
                //                 albums: page.albums.map((album) => {
                //                     if (album.id === albumId) {
                //                         return {
                //                             ...album,
                //                             images: allAlbumImages,
                //                         } satisfies typeof album;
                //                     } else {
                //                         return album;
                //                     }
                //                 }),
                //             })),
                //         };
                //     },
                // );

                return {
                    pages: [
                        {
                            images: allAlbumImages,
                            count: Infinity,
                        },
                    ],
                    pageParams: [allAlbumImages[allAlbumImages.length - 1].id],
                };
            }

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
            if (!album._count.images) return;

            return {
                pageParams: [0],
                pages: [
                    {
                        images: album.images,
                        count: album._count.images,
                    },
                ],
            };
        },
    });
};
