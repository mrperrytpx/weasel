import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "@weasel/schemas";
import { TAlbum, TNewAlbum } from "@weasel/types";
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
                        const lastPage = oldData.pages[oldData.pages.length - 1];
                        lastPage.push(newAlbum);

                        return oldData;
                    }
                },
            );
        },
    });
};
