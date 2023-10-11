import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "@weasel/schemas";
import { TAlbum, TNewAlbum } from "@weasel/types";
import { useUser } from "./useUser";

export const useCreateAlbumMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const createAlbum = async ({ name, description }: TCreateAlbumFormVals) => {
        const data = await apiInstance.post<TNewAlbum>("/api/albums", {
            name,
            description,
        });

        return data.data;
    };

    return useMutation(createAlbum, {
        onSuccess: (data) => {
            queryClient.setQueryData<TAlbum[]>(["albums", user?.data?.id], (oldData) => {
                if (!oldData) {
                    return [data];
                } else {
                    return [...oldData, data];
                }
            });
        },
    });
};
