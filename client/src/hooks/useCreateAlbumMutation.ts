import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "../../../shared/createAlbumSchema";
import { TAlbum } from "../../../shared/types";

export const useCreateAlbumMutation = () => {
    const createAlbum = async ({ name, description }: TCreateAlbumFormVals) => {
        const data = await apiInstance.post<TAlbum>("/api/albums", {
            name,
            description,
        });

        return data.data;
    };

    return useMutation(createAlbum);
};
