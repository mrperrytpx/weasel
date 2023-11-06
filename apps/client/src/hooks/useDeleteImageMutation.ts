import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TInfiniteImages } from "@weasel/types";

type TDeleteImageInput = {
    imageId: string;
    albumId: string;
};

export const useDeleteImageMutation = () => {
    const queryClient = useQueryClient();

    const deleteImage = async ({ imageId }: TDeleteImageInput) => {
        const data = await apiInstance.delete(`/api/images?imageId=${imageId}`);
        return data;
    };

    return useMutation(deleteImage, {
        onMutate: async (input) => {
            await queryClient.cancelQueries(["images", input.albumId]);

            const previousAlbumData = queryClient.getQueryData<InfiniteData<TInfiniteImages>>([
                "images",
                input.albumId,
            ]);

            if (!previousAlbumData) return;

            queryClient.setQueryData<typeof previousAlbumData>(
                ["images", input.albumId],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            images: page.images.filter((img) => img.id !== input.imageId),
                        })),
                    };
                },
            );

            return { previousAlbumData };
        },
        onError: (_err, input, context) => {
            queryClient.setQueryData(["images", input.albumId], context?.previousAlbumData);
        },
    });
};
