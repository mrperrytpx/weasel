import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TAlbum } from "@weasel/types";
import { useLocation, useNavigate } from "react-router-dom";

type TDeleteAlbumInput = {
    albumId: string;
};

export const useDeleteAlbumMutation = () => {
    const user = useUser();
    const queryClient = useQueryClient();
    const location = useLocation();
    const navigate = useNavigate();

    const deleteAlbum = async ({ albumId }: TDeleteAlbumInput) => {
        const data = await apiInstance.delete(`/api/albums/${albumId}`);
        return data;
    };

    return useMutation(deleteAlbum, {
        onMutate: async (vars) => {
            await queryClient.cancelQueries(["albums", user?.data?.id]);

            const previousAllAlbums = queryClient.getQueryData<InfiniteData<TAlbum[]>>([
                "albums",
                user?.data?.id,
            ]);

            if (!previousAllAlbums) return;

            queryClient.setQueryData<InfiniteData<TAlbum[]>>(["albums", user?.data?.id], () => {
                const newData = previousAllAlbums.pages.map((page) =>
                    page.filter((album) => album.id !== vars.albumId),
                );

                return {
                    pages: newData,
                    pageParams: previousAllAlbums.pageParams,
                };
            });

            return { previousAllAlbums };
        },
        onError: (_err, _vars, context) => {
            queryClient.setQueryData(["albums", user?.data?.id], context?.previousAllAlbums);
        },
        onSuccess: async (_data, vars) => {
            await queryClient.invalidateQueries(["albums", user?.data?.id]);
            if (location.pathname !== "/albums") {
                navigate("/albums");
            }
            queryClient.removeQueries(["album", vars.albumId]);
        },
    });
};
