import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";
import { Image, TNewImage } from "@weasel/types";
import { randomString } from "../utils/randomString";

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();

    const uploadMutation = async ({ files, albumId, userId }: TUploadFileMutation) => {
        const data: File[] = [];

        for (let i = 0; i < files.length; i++) {
            data.push(files[i]);
        }

        const images = await uploadFiles(
            {
                files: data,
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

        console.log("res", images);

        return images;
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
                    isUploading: true,
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

            return { albumImages };
        },
        onSuccess: async (data, input) => {
            const albumImages = queryClient.getQueryData<InfiniteData<Image[]>>([
                "images",
                input.albumId,
            ]);
            if (!albumImages) return;

            queryClient.setQueryData<InfiniteData<Image[]>>(["images", input.albumId], () => {
                return {
                    ...albumImages,
                    pages: albumImages.pages.map((page) =>
                        page.map((img) => {
                            const image = data.find((uploadedImg) => uploadedImg.name === img.name);
                            if (image) {
                                return {
                                    ...img,
                                    id: image.key,
                                    name: image.name,
                                    size: image.size,
                                    isUploading: false,
                                } satisfies TNewImage;
                            } else {
                                return img;
                            }
                        }),
                    ),
                };
            });
        },
        onError: async (_err, input, context) => {
            queryClient.setQueryData(["album", input.albumId], context?.albumImages);
            await queryClient.invalidateQueries(["album", input.albumId]);
        },
    });
};
