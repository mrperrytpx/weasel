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
                            pages: [{ albums: [newAlbum], count: 1 }],
                            pageParams: [undefined],
                        };
                    } else {
                        const lastPage = [
                            {
                                albums: [
                                    ...oldData.pages[oldData.pages.length - 1].albums,
                                    newAlbum,
                                ],
                                count: oldData.pages[oldData.pages.length - 1].count + 1,
                            } satisfies TInfiniteAlbums,
                        ];

                        return {
                            ...oldData,
                            pages: [...oldData.pages.slice(0, -1), ...lastPage],
                        };
                    }
                },
            );
        },
    });
};
