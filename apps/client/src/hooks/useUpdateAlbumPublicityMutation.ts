import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "@weasel/types";

type TUpdateAlbumPublicity = {
    albumId: string;
};

export const useUpdateAlbumPublicityMutation = () => {
    const queryClient = useQueryClient();

    const updatePublicity = async ({ albumId }: TUpdateAlbumPublicity) => {
        const response = await apiInstance.patch(`/api/albums/${albumId}`);
        return response.data;
    };

    return useMutation(updatePublicity, {
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["album", vars.albumId]);

            const oldAlbumData = queryClient.getQueryData<TAlbum>(["album", vars.albumId]);

            if (!oldAlbumData) return;

            queryClient.setQueryData<TAlbum>(["album", vars.albumId], (oldData) => {
                if (!oldData) return;

                return {
                    ...oldData,
                    isPublic: !oldData.isPublic,
                };
            });

            return { oldAlbumData };
        },
        onError: (_err, vars, context) => {
            queryClient.setQueryData(["album", vars.albumId], context?.oldAlbumData);
        },
        onSettled: async (_data, _err, vars) => {
            await queryClient.invalidateQueries(["album", vars.albumId]);
        },
    });
};
