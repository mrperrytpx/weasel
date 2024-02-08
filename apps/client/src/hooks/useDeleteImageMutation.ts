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
        onSuccess: () => {
            queryClient.invalidateQueries(["profile-stats", user?.data?.id]);
            queryClient.invalidateQueries(["all-files", user?.data?.id]);
            queryClient.invalidateQueries(["albums", user?.data?.id]);
        },
    });
};
