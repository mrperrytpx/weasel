import { useMutation } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TCreateAlbumFormVals } from "../consts/createAlbumSchema";

export const useCreateAlbumMutation = () => {
    const createAlbum = async ({ name, description }: TCreateAlbumFormVals) => {
        const data = apiInstance.post("/api/albums", {
            name,
            description,
        });

        return data;
    };

    return useMutation(createAlbum);
};
