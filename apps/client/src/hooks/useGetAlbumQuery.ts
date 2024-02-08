import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum, TInfiniteAlbums } from "@weasel/types";
import { useUser } from "./useUser";

export const useGetAlbumQuery = (albumId: string) => {
    const queryClient = useQueryClient();
    const user = useUser();

    const fetchAlbum = async () => {
        const response = await apiInstance.get<TAlbum>(`/api/albums/${albumId}`);

        return response.data;
    };

    return useQuery({
        queryKey: ["album", albumId],
        queryFn: fetchAlbum,
        staleTime: 1000,
        initialData: () => {
            const allAlbums = queryClient.getQueryData<InfiniteData<TInfiniteAlbums>>([
                "albums",
                user?.data?.id,
            ]);

            if (!allAlbums) return;

            const album = allAlbums.pages.reduce<TAlbum | null>((result, page) => {
                const target = page.albums.find((album) => album.id === albumId);
                if (target) return target;
                return result;
            }, null);

            if (!album) return;

            return album;
        },
    });
};
