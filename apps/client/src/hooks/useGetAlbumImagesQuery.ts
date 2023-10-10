import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TAlbum, TFullAlbum } from "@weasel/types";

const fetchImages = async (albumId: string) => {
    const data = await apiInstance.get<TFullAlbum>(`/api/albums/${albumId}`);
    return data.data;
};

export const useGetAlbumImagesQuery = (albumId: string) => {
    const user = useUser();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ["album", albumId],
        queryFn: async () => fetchImages(albumId),
        enabled: !!albumId,
        initialData: () => {
            const allAlbums: TAlbum[] | undefined = queryClient.getQueryData([
                "albums",
                user?.data?.id,
            ]);

            if (!allAlbums) return;

            const album = allAlbums.find((album) => album.id === albumId);

            if (!album) return;

            return { ...album, images: album.images.length ? [...album.images] : [] } satisfies TFullAlbum;
        },
    });
};
