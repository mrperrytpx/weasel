import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "@weasel/schemas";
import { TBaseAlbum } from "@weasel/types";

export const useCreateAlbumMutation = () => {
    const createAlbum = async ({ name, description }: TCreateAlbumFormVals) => {
        const data = await apiInstance.post<TBaseAlbum>("/api/albums", {
            name,
            description,
        });

        return data.data;
    };

    return useMutation(createAlbum);
};
