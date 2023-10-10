import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";
import { TFullAlbum } from "@weasel/types";
import { Image } from ".prisma/client";

export const useUploadFilesMutation = () => {
    const queryClient = useQueryClient();

    const func = async ({ files, albumId, userId }: TUploadFileMutation) => {
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

    return useMutation(func, {
        onMutate: (input) => {
            const { albumId, userId } = input;

            return { albumId, userId };
        },
        onSuccess: async (data, _vars, context) => {
            if (!context) return;
            const albumData = queryClient.getQueryData<TFullAlbum>(["album", context.albumId]);

            if (!albumData) return;

            const newImages = data.map((img) => {
                return {
                    album_id: context.albumId,
                    created_at: new Date(),
                    id: img.key,
                    name: img.name,
                    owner_id: context.userId,
                    size: img.size,
                    url: img.url,
                } satisfies Image;
            }) satisfies Image[];

            queryClient.setQueryData<TFullAlbum>(["album", context.albumId], () => {
                return {
                    ...albumData,
                    images: albumData.images.length
                        ? [...albumData.images, ...newImages]
                        : [...newImages],
                };
            });
        },
    });
};
