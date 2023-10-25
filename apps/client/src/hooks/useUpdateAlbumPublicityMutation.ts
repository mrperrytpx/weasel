import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "@weasel/types";
import { useUser } from "./useUser";

type TUpdateAlbumPublicity = {
    albumId: string;
};

export const useUpdateAlbumPublicityMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const updatePublicity = async ({ albumId }: TUpdateAlbumPublicity) => {
        const response = await apiInstance.patch(`/api/albums/${albumId}`);
        return response.data;
    };

    return useMutation(updatePublicity, {
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["album", vars.albumId]);

            const oldAlbumData = queryClient.getQueryData<TAlbum>(["album", vars.albumId]);

            const allOldAlbumsData = queryClient.getQueryData<InfiniteData<TAlbum[]>>([
                "albums",
                user?.data?.id,
            ]);

            if (!oldAlbumData && !allOldAlbumsData) return;

            queryClient.setQueryData<TAlbum>(["album", vars.albumId], (oldData) => {
                if (!oldData) return;

                return {
                    ...oldData,
                    isPublic: !oldData.isPublic,
                };
            });
            queryClient.setQueryData<InfiniteData<TAlbum[]>>(
                ["albums", user?.data?.id],
                (oldData) => {
                    if (!oldData) return;

                    const newData = oldData.pages.map((page) =>
                        page.map((album) =>
                            album.id === vars.albumId
                                ? { ...album, isPublic: !album.isPublic }
                                : album,
                        ),
                    );

                    return {
                        pageParams: oldData.pageParams,
                        pages: newData,
                    };
                },
            );

            return { oldAlbumData, allOldAlbumsData };
        },
        onError: (_err, vars, context) => {
            queryClient.setQueryData(["album", vars.albumId], context?.oldAlbumData);
            queryClient.setQueryData(["albums", user?.data?.id], context?.allOldAlbumsData);
        },
        onSettled: async (_data, _err, vars) => {
            await queryClient.invalidateQueries(["album", vars.albumId]);
            await queryClient.invalidateQueries(["albums", user?.data?.id]);
        },
    });
};
