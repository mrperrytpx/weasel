import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TAlbum } from "@weasel/types";

type TDeleteAlbumInput = {
    albumId: string;
};

export const useDeleteAlbumMutation = () => {
    const user = useUser();
    const queryClient = useQueryClient();

    const deleteAlbum = async ({ albumId }: TDeleteAlbumInput) => {
        const data = await apiInstance.delete(`/api/albums/${albumId}`);
        return data;
    };

    return useMutation(deleteAlbum, {
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["albums", user?.data?.id]);

            const previousAllAlbums = queryClient.getQueryData<TAlbum[]>([
                "albums",
                user?.data?.id,
            ]);

            if (!previousAllAlbums) return;

            queryClient.setQueryData<TAlbum[]>(["albums", user?.data?.id], () => {
                return previousAllAlbums.filter((album) => album.id !== vars.albumId);
            });

            return { previousAllAlbums };
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(["albums", user?.data?.id], context?.previousAllAlbums);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["albums", user?.data?.id]);
        },
    });
};
