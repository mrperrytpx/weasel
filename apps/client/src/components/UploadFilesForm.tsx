import { zodResolver } from "@hookform/resolvers/zod";
import { TUploadFilesFormVals, filesFormSchema } from "@weasel/schemas";
import { z } from "zod";

import { useForm, SubmitHandler } from "react-hook-form";
import { BsUpload } from "react-icons/bs";
import { useParams, useNavigate } from "react-router-dom";
import { useUploadFilesMutation } from "../hooks/useUploadFilesMutation";
import { useUser } from "../hooks/useUser";

export const UploadFilesForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const user = useUser();

    const albumId = z.string().parse(params.albumId);

    const uploadFiles = useUploadFilesMutation();

    const { register, handleSubmit, watch, reset } = useForm<TUploadFilesFormVals>({
        resolver: zodResolver(filesFormSchema),
    });

    if (!params.albumId) navigate("/albums");

    const onSubmit: SubmitHandler<TUploadFilesFormVals> = async (data) => {
        await uploadFiles.mutateAsync({ ...data, albumId, userId: user?.data?.id as string });
        reset();
    };

    const files: FileList = watch("files");

    return (
        <form
            className="flex break-inside-avoid flex-col items-center gap-4"
            onSubmit={handleSubmit(onSubmit)}
        >
            <fieldset className="flex items-center gap-1">
                <label aria-hidden className="relative h-10 max-w-[8rem] cursor-pointer">
                    <input
                        {...register("files")}
                        multiple
                        type="file"
                        id="file"
                        aria-hidden
                        aria-label="File browser example"
                        className="h-full w-full opacity-0"
                    />
                    <span className="absolute inset-0 z-10 h-10 w-full select-none rounded-md bg-white px-4 py-2 shadow after:inset-0 after:line-clamp-1 after:w-full after:break-all after:content-['Choose_files...'] hover:bg-gray-200 dark:text-zinc-950" />
                </label>
                {files?.length > 0 && (
                    <button
                        type="submit"
                        aria-label="Upload files."
                        disabled={uploadFiles.isLoading}
                        className="flex w-[8rem] items-center justify-center gap-2 rounded-lg bg-white p-2 text-center text-lg font-medium shadow transition-colors duration-75 enabled:hover:bg-periwinkle-600 enabled:hover:text-periwinkle-50 enabled:focus:outline-periwinkle-600 disabled:opacity-50 dark:text-periwinkle-950 enabled:dark:hover:text-periwinkle-50 md:text-xl"
                    >
                        <span className="text-sm">
                            {uploadFiles.isLoading ? "Uploading..." : "Upload"}
                        </span>
                        <BsUpload size={24} />
                    </button>
                )}
            </fieldset>
            {files?.length > 0 && (
                <div className="w-full max-w-sm rounded-lg bg-white p-2 font-medium dark:text-periwinkle-800">
                    {[...files].map((file) => (
                        <span className="line-clamp-1 break-all py-0.5 pl-1" key={file.name}>
                            {file.name}
                        </span>
                    ))}
                </div>
            )}
        </form>
    );
};
