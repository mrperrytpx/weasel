import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "../../../shared/types";

const fetchImages = async (albumId: string) => {
    const data = apiInstance.get<TAlbum>(`/api/albums/${albumId}`);
    return data;
};

export const useGetAlbumImagesQuery = (albumId: string) => {
    return useQuery({
        queryKey: ["album-images", albumId],
        queryFn: async () => fetchImages(albumId),
        enabled: !!albumId,
    });
};
