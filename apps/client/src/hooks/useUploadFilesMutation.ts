import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";
import { TFullAlbum, TNewImage } from "@weasel/types";
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
        onMutate: (vars) => {
            const albumData = queryClient.getQueryData<TFullAlbum>(["album", vars.albumId]);

            if (!albumData) return;

            const data: File[] = [];

            for (let i = 0; i < vars.files.length; i++) {
                data.push(vars.files[i]);
            }

            const newImages = data.map((img) => {
                return {
                    album_id: vars.albumId,
                    created_at: new Date(),
                    id: randomString(10),
                    name: img.name,
                    owner_id: vars.userId,
                    size: img.size,
                    url: URL.createObjectURL(img),
                    isUploading: true,
                } satisfies TNewImage;
            }) satisfies TNewImage[];

            queryClient.setQueryData<TFullAlbum>(["album", vars.albumId], () => {
                return {
                    ...albumData,
                    images: albumData.images.length
                        ? [...newImages, ...albumData.images]
                        : [...newImages],
                };
            });

            return { albumData };
        },
        onSuccess: async (data, vars) => {
            const albumData = queryClient.getQueryData<TFullAlbum>(["album", vars.albumId]);
            if (!albumData) return;

            queryClient.setQueryData<TFullAlbum>(["album", vars.albumId], () => {
                return {
                    ...albumData,
                    images: albumData.images.map((img) => {
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
                };
            });
        },
        onError: async (_err, vars, context) => {
            queryClient.setQueryData(["album", vars.albumId], context?.albumData);
            await queryClient.invalidateQueries(["album", vars.albumId]);
        },
    });
};
