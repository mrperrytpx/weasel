import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";
import { TInfiniteAlbums, TInfiniteImages, TNewImage } from "@weasel/types";
import { randomString } from "../utils/randomString";
import { FILE_MAX_SIZE } from "../utils/tierStorageSizes";
import { useUser } from "./useUser";

type TCUploadFileResponse = {
    key: string;
    name: string;
    url: string;
    size: number;
};

const uploadFile = async (file: File, albumId: string, userId: string) => {
    if (file.size >= FILE_MAX_SIZE) {
        return {
            status: "rejected",
            reason: "File size too big.",
        } satisfies PromiseRejectedResult;
    }

    const res = await uploadFiles(
        {
            files: [file],
            endpoint: "imageUploader",
            input: {
                albumId,
                userId,
                fileSize: file.size,
            },
        },
        {
            url: import.meta.env.VITE_SERVER_URL + "/api/uploadthing",
        },
    );

    return res.flat();
};

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();
    const user = useUser();

    const uploadMutation = async ({
        files,
        albumId,
        userId,
    }: Omit<TUploadFileMutation, "fileSize">) => {
        const data: File[] = [];

        for (let i = 0; i < files.length; i++) {
            data.push(files[i]);
        }

        const uploadedFiles: TCUploadFileResponse[] = (
            await Promise.allSettled(data.map((file) => uploadFile(file, albumId, userId)))
        )
            .filter((x) => x.status === "fulfilled")
            .map((x) => (x as PromiseFulfilledResult<TCUploadFileResponse[]>).value)
            .flat();

        return uploadedFiles;
    };

    return useMutation(uploadMutation, {
        onMutate: (input) => {
            const albumImages = queryClient.getQueryData<InfiniteData<TInfiniteImages>>([
                "images",
                input.albumId,
            ]);

            const data: File[] = [];

            for (let i = 0; i < input.files.length; i++) {
                data.push(input.files[i]);
            }

            const newImages = data.map((img) => {
                return {
                    album_id: input.albumId,
                    created_at: new Date(),
                    id: randomString(10),
                    name: img.name,
                    owner_id: input.userId,
                    size: img.size,
                    url: URL.createObjectURL(img),
                    uploadStatus: "uploading",
                } satisfies TNewImage;
            });

            queryClient.setQueryData<typeof albumImages>(["images", input.albumId], (oldData) => {
                if (!oldData)
                    return {
                        pageParams: [0],
                        pages: [
                            {
                                count: Infinity,
                                images: [...newImages],
                            },
                        ],
                    };

                const lastPage = {
                    count: oldData.pages[0].count + newImages.length,
                    images: [...oldData.pages[oldData.pages.length - 1].images, ...newImages],
                };

                return {
                    pageParams: oldData.pageParams,
                    pages: [...oldData.pages.slice(0, -1), lastPage],
                };
            });

            return { albumImages, newImages };
        },
        onSuccess: async (data, input, context) => {
            if (!data) return;

            if (!context?.newImages.length) return;

            const updateImageData = (img: TNewImage) => {
                const image = data.find((uploadedImg) => uploadedImg.name === img.name);

                if (image) {
                    return {
                        ...img,
                        id: image.key,
                        name: image.name,
                        size: image.size,
                        uploadStatus: "finished",
                    } satisfies TNewImage;
                } else {
                    return img;
                }
            };

            queryClient.setQueryData<InfiniteData<TInfiniteImages>>(
                ["images", input.albumId],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            images: page.images.map(updateImageData),
                        })),
                    };
                },
            );

            queryClient.setQueryData<InfiniteData<TInfiniteAlbums>>(
                ["albums", user?.data?.id],
                (oldData) => {
                    if (!oldData) return;

                    const newPages = oldData.pages.map((page) => {
                        const albumInCache = page.albums.find(
                            (album) => album.id === input.albumId,
                        );
                        if (albumInCache) {
                            return {
                                ...page,
                                albums: page.albums.map(
                                    (album) =>
                                        ({
                                            ...album,
                                            _count: {
                                                images:
                                                    album._count.images + context.newImages.length,
                                            },
                                        }) satisfies typeof album,
                                ),
                            } satisfies typeof page;
                        } else {
                            return page;
                        }
                    });

                    return {
                        pageParams: oldData.pageParams,
                        pages: newPages,
                    };
                },
            );
        },
        onError: (_err, input, context) => {
            queryClient.setQueryData(["images", input.albumId], context?.albumImages);
        },
        onSettled: (_data, _err, input) => {
            setTimeout(async () => {
                await queryClient.invalidateQueries(["images", input.albumId]);
            }, 5000);
        },
    });
};
