import { useQuery } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "@weasel/types";

const fetchPublicAlbum = async (albumId: string) => {
    const response = await apiInstance.get<TAlbum | null>(`/api/albums/public/${albumId}`);

    return response.data;
};

export const useGetPublicAlbumQuery = (albumId: string) => {
    return useQuery({
        queryKey: ["public-album", albumId],
        queryFn: () => fetchPublicAlbum(albumId),
        enabled: !!albumId,
    });
};
