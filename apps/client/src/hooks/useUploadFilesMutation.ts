import { useMutation } from "@tanstack/react-query";
import { uploadFiles } from "../utils/generateHelpers";
import { TUploadFileMutation } from "@weasel/schemas";

export const useUploadFilesMutation = () => {
    const func = async ({ files, albumId, userId }: TUploadFileMutation) => {
        const data: File[] = [];

        for (let i = 0; i < files.length; i++) {
            data.push(files[i]);
        }

        const res = await uploadFiles(
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

        console.log(res);

        return res;
    };

    return useMutation(func);
};
