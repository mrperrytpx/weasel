import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { Image, TAlbum } from "@weasel/types";
import { useUser } from "./useUser";

const IMAGE_OFFSET = 20;

export const useGetAlbumQuery = (albumId: string) => {
    const queryClient = useQueryClient();
    const user = useUser();

    const fetchAlbum = async () => {
        const response = await apiInstance.get<TAlbum>(`/api/albums/${albumId}`);

        queryClient.setQueryData<InfiniteData<Image[]>>(["images", albumId], () => {
            return {
                pageParams:
                    response.data.images.length >= IMAGE_OFFSET
                        ? [response.data.images.length]
                        : [0],
                pages: [response.data.images],
            };
        });

        queryClient.setQueryData<InfiniteData<TAlbum[]>>(["albums", user?.data?.id], (oldData) => {
            if (!oldData) {
                return {
                    pageParams: [0],
                    pages: [[response.data]],
                };
            }

            if (oldData.pages.find((page) => page.find((album) => album.id === response.data.id))) {
                return oldData;
            }

            const newData = oldData.pages.map((page, pageIdx) => {
                if (pageIdx === oldData.pages.length - 1) {
                    return [...page, response.data];
                } else {
                    return page;
                }
            });

            return {
                pageParams: oldData.pageParams,
                pages: newData,
            };
        });

        return response.data;
    };

    return useQuery({
        queryKey: ["album", albumId],
        queryFn: fetchAlbum,
        initialData: () => {
            const allAlbums = queryClient.getQueryData<InfiniteData<TAlbum[]>>([
                "albums",
                user?.data?.id,
            ]);

            if (!allAlbums) return;

            const album = allAlbums.pages.flat().find((album) => album.id === albumId);

            if (!album) return;

            return album;
        },
    });
};
