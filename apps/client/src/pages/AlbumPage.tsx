import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUploadFilesMutation } from "../hooks/useUploadFilesMutation";
import { useUser } from "../hooks/useUser";
import { TUploadFilesFormVals, filesFormSchema } from "@weasel/schemas";
import { Image } from "@weasel/types";

type TAlbumImageProps = {
    image: Image;
};

const AlbumImage = ({ image }: TAlbumImageProps) => {
    return (
        <div className="my-4 flex break-inside-avoid flex-col items-start justify-start">
            <a
                href={image.url}
                target="_blank"
                referrerPolicy="no-referrer"
                className=" border-2 border-periwinkle-50 hover:border-periwinkle-500 dark:border-zinc-950 dark:hover:border-white"
            >
                <img src={image.url} alt="image" className="select-none object-cover" />
            </a>
            <p className="line-clamp-1 break-all pl-0.5 font-semibold text-black dark:text-periwinkle-50">
                {image.name}
            </p>
        </div>
    );
};

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

            <div className="my-8 columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-8">
                <form
                    className="flex flex-col items-center justify-center gap-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input {...register("files")} type="file" multiple={true} />
                    <button
                        type="submit"
                        disabled={uploadFiles.isLoading}
                        className="w-full max-w-[8rem] rounded-lg bg-white p-2 text-center text-lg font-medium shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:text-periwinkle-950 dark:hover:text-periwinkle-50 md:text-xl"
                    >
                        Submit!
                    </button>
                </form>
                {album.data?.images.map((image) => <AlbumImage image={image} key={image.id} />)}
            </div>
        </div>
    );
};

export default AlbumPage;
