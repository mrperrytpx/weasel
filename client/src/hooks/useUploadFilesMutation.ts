import { useMutation } from "@tanstack/react-query";
import { TUploadFilesFormVals } from "../pages/AlbumPage";
import { uploadFiles } from "../utils/generateHelpers";

export const useUploadFilesMutation = () => {
    const func = async ({ files }: TUploadFilesFormVals) => {
        // console.log("files", files);
        const data: File[] = [];

        for (let i = 0; i < files.length; i++) {
            data.push(files[i]);
        }

        // console.log(data);

        const res = await uploadFiles(
            {
                files: data,
                endpoint: "imageUploader",
            },
            {
                url: import.meta.env.VITE_SERVER_URL + "/api/uploadthing",
            },
        );

        // console.log(res);

        return res;
    };

    return useMutation(func);
};
