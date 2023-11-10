import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "@weasel/schemas";
import { TAlbum, TInfiniteAlbums, TNewAlbum } from "@weasel/types";
import { useUser } from "./useUser";

export const useCreateAlbumMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const createAlbum = async ({ name }: TCreateAlbumFormVals) => {
        const response = await apiInstance.post<TNewAlbum>("/api/albums", {
            name,
        });

        return response.data;
    };

    return useMutation(createAlbum, {
        onSuccess: (data) => {
            queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
                ["albums", user?.data?.id],
                (oldData) => {
                    const newAlbum = {
                        ...data,
                        _count: {
                            images: 0,
                        },
                    } satisfies TAlbum;

                    if (!oldData) {
                        return {
                            pages: [{ albums: [newAlbum], count: Infinity }],
                            pageParams: [0],
                        };
                    } else {
                        const firstPage = [
                            {
                                albums: [newAlbum, ...oldData.pages[0].albums],
                                count: oldData.pages[0].count + 1,
                            } satisfies TInfiniteAlbums,
                        ];

                        return {
                            ...oldData,
                            pages: [...firstPage, ...oldData.pages.slice(1)],
                        };
                    }
                },
            );
        },
    });
};
