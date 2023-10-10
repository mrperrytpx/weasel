import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFilesMutation } from "../hooks/useUploadFilesMutation";
import { useUser } from "../hooks/useUser";
import { TUploadFilesFormVals, filesFormSchema } from "@weasel/schemas";

const AlbumPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const user = useUser();

    const albumId = z.string().parse(params.albumId);
    const album = useGetAlbumImagesQuery(albumId);

    const uploadFiles = useUploadFilesMutation();

    const { register, handleSubmit } = useForm<TUploadFilesFormVals>({
        resolver: zodResolver(filesFormSchema),
    });

    if (!params.albumId) navigate("/albums");

    const onSubmit: SubmitHandler<TUploadFilesFormVals> = async (data) => {
        await uploadFiles.mutateAsync({ ...data, albumId, userId: user?.data?.id as string });
    };

    return (
        <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col">
            <div className="flex flex-wrap items-center justify-between border-b border-periwinkle-300 px-4 py-2 dark:border-zinc-600">
                <span className="text-xl font-bold">{album.data?.name}</span>
                <span>
                    {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                    }).format(new Date(album.data!.created_at))}
                </span>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("files")} type="file" multiple={true} />
                <button
                    type="submit"
                    disabled={uploadFiles.isLoading}
                    className="w-full max-w-[8rem] rounded-lg bg-white p-2 text-center text-lg font-medium shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:text-periwinkle-950 dark:hover:text-periwinkle-50 md:text-xl"
                >
                    Submit!
                </button>
            </form>
            <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap gap-4 p-4">
                {album.data?.images.map((image) => (
                    <img
                        key={image.id}
                        className="inline self-baseline"
                        src={image.url}
                        alt="Image"
                    />
                ))}
            </div>
        </div>
    );
};

export default AlbumPage;
