import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "@weasel/schemas";
import { TAlbum, TNewAlbum } from "@weasel/types";
import { useUser } from "./useUser";

export const useCreateAlbumMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const createAlbum = async ({ name }: TCreateAlbumFormVals) => {
        const data = await apiInstance.post<TNewAlbum>("/api/albums", {
            name,
        });

        return data.data;
    };

    return useMutation(createAlbum, {
        onSuccess: (data) => {
            queryClient.setQueryData<InfiniteData<TAlbum[]>>(
                ["albums", user?.data?.id],
                (oldData) => {
                    const newAlbum = {
                        ...data,
                        _count: {
                            images: 0,
                        },
                    } satisfies TAlbum;

                    if (!oldData) {
                        return { pages: [[newAlbum]], pageParams: [0] };
                    } else {
                        return { ...oldData, pages: [...oldData.pages, [newAlbum]] };
                    }
                },
            );
        },
    });
};
