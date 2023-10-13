import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TFullAlbum } from "@weasel/types";

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
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["album", vars.albumId]);

            const previousAlbumData = queryClient.getQueryData<TFullAlbum>(["album", vars.albumId]);

            if (!previousAlbumData?.images.length) return;

            queryClient.setQueryData<TFullAlbum>(["album", vars.albumId], () => {
                return {
                    ...previousAlbumData,
                    images: previousAlbumData.images.filter((img) => img.id !== vars.imageId),
                };
            });

            return { previousAlbumData };
        },
        onError: (_err, vars, context) => {
            queryClient.setQueryData(["album", vars.albumId], context?.previousAlbumData);
        },
    });
};
