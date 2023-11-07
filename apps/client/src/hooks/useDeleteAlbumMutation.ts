import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TInfiniteAlbums, TInfiniteFiles, TInfiniteImages } from "@weasel/types";
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
        const response = await apiInstance.delete(`/api/albums/${albumId}`);
        return response;
    };

    return useMutation(deleteAlbum, {
        onMutate: async (input) => {
            await queryClient.cancelQueries(["albums", user?.data?.id]);

            const previousAllAlbums = queryClient.getQueryData<InfiniteData<TInfiniteAlbums>>([
                "albums",
                user?.data?.id,
            ]);

            const previousAlbumImages = queryClient.getQueryData<InfiniteData<TInfiniteImages>>([
                "images",
                input.albumId,
            ]);

            if (previousAlbumImages) {
                queryClient.setQueryData<InfiniteData<TInfiniteFiles>>(
                    ["all-files", user?.data?.id],
                    (oldData) => {
                        if (!oldData) return;

                        const images = previousAlbumImages.pages
                            .map((page) => page.images.map((image) => image.id))
                            .flat();

                        const newAllFiles = oldData?.pages.map((page) => ({
                            ...page,
                            files: page.files.filter((file) => images.indexOf(file.id) === -1),
                        }));

                        return {
                            pageParams: oldData.pageParams,
                            pages: newAllFiles,
                        };
                    },
                );
            }

            queryClient.setQueryData<typeof previousAllAlbums>(
                ["albums", user?.data?.id],
                (oldData) => {
                    if (!oldData) return;

                    const newData = oldData.pages
                        .map((page) => {
                            return {
                                albums: page.albums.filter((album) => album.id !== input.albumId),
                                count: page.count - 1,
                            } satisfies typeof page;
                        })
                        .filter((page) => page.albums.length);

                    if (!newData.length) {
                        return {
                            pageParams: oldData.pageParams,
                            pages: [
                                {
                                    count: Infinity,
                                    albums: [],
                                },
                            ],
                        };
                    }

                    return {
                        pages: newData,
                        pageParams: oldData.pageParams,
                    };
                },
            );

            return { previousAllAlbums };
        },
        onError: (_err, _input, context) => {
            queryClient.setQueryData(["albums", user?.data?.id], context?.previousAllAlbums);
        },
        onSuccess: async (_data, input) => {
            await queryClient.invalidateQueries(["albums", user?.data?.id]);
            queryClient.invalidateQueries(["profile-stats", user?.data?.id]);

            if (location.pathname !== "/albums") {
                navigate("/albums");
            }
            queryClient.removeQueries(["images", input.albumId]);
        },
    });
};
