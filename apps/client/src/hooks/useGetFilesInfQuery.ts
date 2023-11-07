import { InfiniteData, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../utils/axiosClients";
import { useUser } from "./useUser";
import { TInfiniteFiles, TInfiniteImages, TNewImage } from "@weasel/types";

export const useGetFilesInfQuery = () => {
    const user = useUser();
    const queryClient = useQueryClient();

    const fetchAlbums = async (pageParam: string) => {
        const response = await apiInstance.get<TInfiniteFiles>(`/api/images?cursorId=${pageParam}`);

        if (response.data.files.length) {
            if (!user?.data) return response.data;
            response.data.files.forEach((file) => {
                queryClient.setQueryData<InfiniteData<TInfiniteImages>>(
                    ["images", file.album.id],
                    (oldData) => {
                        if (!oldData) {
                            return {
                                pageParams: [file.id],
                                pages: [
                                    {
                                        count: Infinity,
                                        images: [
                                            {
                                                created_at: file.created_at,
                                                id: file.id,
                                                name: file.name,
                                                size: file.size,
                                                url: file.url,
                                                album_id: file.album.id,
                                                owner_id: user.data.id,
                                            } satisfies TNewImage,
                                        ],
                                    },
                                ],
                            };
                        }

                        const image = oldData.pages.reduce<TNewImage | null>((result, page) => {
                            const target = page.images.find((img) => img.id === file.id);
                            if (target) return target;
                            return result;
                        }, null);

                        if (image) return oldData;

                        const albumImages = oldData.pages.map((page) => page.images).flat();

                        const lastPage = {
                            count: Infinity,
                            images: [
                                ...albumImages,
                                {
                                    created_at: file.created_at,
                                    id: file.id,
                                    name: file.name,
                                    size: file.size,
                                    url: file.url,
                                    album_id: file.album.id,
                                    owner_id: user.data.id,
                                } satisfies TNewImage,
                            ] satisfies TNewImage[],
                        } satisfies TInfiniteImages;

                        return {
                            pageParams: [lastPage.images[lastPage.images.length - 1].id],
                            pages: [...oldData.pages.slice(0, -1), lastPage],
                        };
                    },
                );
            });
        }

        return response.data;
    };

    return useInfiniteQuery({
        queryKey: ["all-files", user?.data?.id],
        queryFn: ({ pageParam = 0 }) => fetchAlbums(pageParam),
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage?.nextId) return undefined;
            const totalFetchedFiles = pages.reduce((acc, curr) => acc + curr.files.length, 0);
            if (totalFetchedFiles >= lastPage.count) {
                return undefined;
            }
            if (lastPage.count) return lastPage.nextId;
        },
    });
};
