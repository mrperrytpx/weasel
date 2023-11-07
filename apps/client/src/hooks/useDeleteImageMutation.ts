import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TInfiniteAlbums, TInfiniteFiles, TInfiniteImages } from "@weasel/types";
import { useUser } from "./useUser";

type TDeleteImageInput = {
    imageId: string;
    albumId: string;
};

export const useDeleteImageMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const deleteImage = async ({ imageId }: TDeleteImageInput) => {
        const data = await apiInstance.delete(`/api/images?imageId=${imageId}`);
        return data;
    };

    return useMutation(deleteImage, {
        onMutate: async (input) => {
            await queryClient.cancelQueries(["images", input.albumId]);
            await queryClient.cancelQueries(["album", input.albumId]);
            await queryClient.cancelQueries(["all-files", user?.data?.id]);

            const previousAlbumImagesData = queryClient.getQueryData<InfiniteData<TInfiniteImages>>(
                ["images", input.albumId],
            );

            const previousFilesData = queryClient.getQueryData<InfiniteData<TInfiniteFiles>>([
                "all-files",
                user?.data?.id,
            ]);

            const previousAllAlbumsData = queryClient.getQueryData<InfiniteData<TInfiniteAlbums>>([
                "albums",
                user?.data?.id,
            ]);

            queryClient.setQueryData<typeof previousAlbumImagesData>(
                ["images", input.albumId],
                (oldData) => {
                    if (!oldData) return;

                    const newPages = oldData.pages
                        .map(
                            (page) =>
                                ({
                                    ...page,
                                    count: page.count - 1,
                                    images: page.images.filter((img) => img.id !== input.imageId),
                                }) satisfies typeof page,
                        )
                        .filter((page) => page.images.length);

                    if (!newPages.length) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    count: Infinity,
                                    images: [],
                                },
                            ],
                        };
                    }

                    return {
                        pageParams: oldData.pageParams,
                        pages: newPages,
                    };
                },
            );

            queryClient.setQueryData<typeof previousFilesData>(
                ["all-files", user?.data?.id],
                (oldData) => {
                    if (!oldData) return;

                    const newPages = oldData.pages
                        .map(
                            (page) =>
                                ({
                                    ...page,
                                    count: page.count - 1,
                                    files: page.files.filter((file) => file.id !== input.imageId),
                                }) satisfies typeof page,
                        )
                        .filter((page) => page.files.length);

                    if (!newPages.length) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    count: 0,
                                    files: [],
                                    nextId: "",
                                },
                            ],
                        };
                    }

                    return {
                        pageParams: oldData.pageParams,
                        pages: newPages,
                    };
                },
            );

            queryClient.setQueryData<typeof previousAllAlbumsData>(
                ["albums", user?.data?.id],
                (oldData) => {
                    if (!oldData) return;

                    const newPages = oldData.pages
                        .map((page) => {
                            const albumInCache = page.albums.find(
                                (album) => album.id === input.albumId,
                            );
                            if (albumInCache) {
                                return {
                                    ...page,
                                    albums: page.albums.map((album) => ({
                                        ...album,
                                        images: album.images.filter(
                                            (image) => image.id !== input.imageId,
                                        ),
                                        _count: {
                                            images: album._count.images - 1,
                                        },
                                    })),
                                };
                            } else {
                                return page;
                            }
                        })
                        .filter((page) => page.albums.length);

                    if (!newPages) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    albums: [],
                                    count: Infinity,
                                },
                            ],
                        };
                    }

                    return {
                        pageParams: oldData.pageParams,
                        pages: newPages,
                    };
                },
            );

            return {
                previousAlbumImagesData,
                previousFilesData,
                previousAllAlbumsData,
            };
        },
        onError: (_err, input, context) => {
            queryClient.setQueryData(["images", input.albumId], context?.previousAlbumImagesData);
            queryClient.setQueryData(["all-files", user?.data?.id], context?.previousFilesData);
            queryClient.setQueryData(["albums", user?.data?.id], context?.previousAllAlbumsData);
        },
    });
};
