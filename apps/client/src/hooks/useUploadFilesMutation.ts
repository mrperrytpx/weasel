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

const IMAGE_MAX_SIZE = 4_194_304;

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();

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
            await Promise.allSettled(
                data.map(async (file) => {
                    if (file.size >= IMAGE_MAX_SIZE) {
                        return {
                            status: "rejected",
                            reason: "File size too big",
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
                }),
            )
        )
            .filter((x) => x.status === "fulfilled")
            .map((x) => (x as PromiseFulfilledResult<TCUploadFileResponse[]>).value)
            .flat();

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
