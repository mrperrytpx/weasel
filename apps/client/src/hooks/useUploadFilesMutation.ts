import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";
import { Image, TNewImage } from "@weasel/types";
import { randomString } from "../utils/randomString";

type TCUploadFileResponse = {
    key: string;
    name: string;
    url: string;
    size: number;
};

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();

    const uploadMutation = async ({ files, albumId, userId }: TUploadFileMutation) => {
        const data: File[] = [];

        for (let i = 0; i < files.length; i++) {
            data.push(files[i]);
        }

        const uploadedFiles: TCUploadFileResponse[] = [];

        for (const file of data) {
            try {
                const images = await uploadFiles(
                    {
                        files: [file],
                        endpoint: "imageUploader",
                        input: {
                            albumId,
                            userId,
                        },
                    },
                    {
                        url: import.meta.env.VITE_SERVER_URL + "/api/uploadthing",
                    },
                );

                uploadedFiles.push(...images);
            } catch (err) {
                console.log(JSON.stringify(err, null, 2));
            }
        }

        return uploadedFiles;
    };

    return useMutation(uploadMutation, {
        onMutate: (input) => {
            const albumImages = queryClient.getQueryData<InfiniteData<Image[]>>([
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
            }) satisfies TNewImage[];

            queryClient.setQueryData<InfiniteData<Image[]>>(
                ["images", input.albumId],
                (oldData) => {
                    if (!oldData) return { pageParams: [0], pages: [newImages] };

                    return {
                        ...oldData,
                        pages: [
                            ...oldData.pages.slice(0, -1),
                            [...oldData.pages[oldData.pages.length - 1], ...newImages],
                        ],
                    };
                },
            );

            return { albumImages, newImages };
        },
        onSuccess: async (data, input, context) => {
            if (!data) return;

            if (!context?.newImages.length) return;

            queryClient.setQueryData<InfiniteData<TNewImage[]>>(
                ["images", input.albumId],
                (oldData) => {
                    if (!oldData) return;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) =>
                            page.map((img) => {
                                const image = data.find(
                                    (uploadedImg) => uploadedImg.name === img.name,
                                );

                                if (image) {
                                    return {
                                        ...img,
                                        id: image.key,
                                        name: image.name,
                                        size: image.size,
                                        uploadStatus: "finished",
                                    } satisfies TNewImage;
                                } else {
                                    return {
                                        ...img,
                                        uploadStatus:
                                            img.uploadStatus === "uploading" ? "failed" : undefined,
                                    } satisfies TNewImage;
                                }
                            }),
                        ),
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
