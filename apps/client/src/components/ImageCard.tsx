import { TNewImage } from "@weasel/types";
import { useDeleteImageMutation } from "../hooks/useDeleteImageMutation";
import { BsTrash } from "react-icons/bs";
import { LoadingSpinner } from "./LoadingSpinner";

type TImageCardProps = {
    image: TNewImage;
};

export const ImageCard = ({ image }: TImageCardProps) => {
    const deleteImage = useDeleteImageMutation();

    const handleDeleteImage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        await deleteImage.mutateAsync({ imageId: image.id, albumId: image.album_id });
    };

    return (
        <figure className="relative mx-auto my-8 flex aspect-square w-full max-w-sm break-inside-avoid flex-col items-start justify-start rounded-lg border-2 border-periwinkle-50 bg-white transition-all duration-75 hover:border-periwinkle-500 dark:border-zinc-950 dark:bg-zinc-900 dark:hover:border-periwinkle-500">
            <a
                href={image.url}
                target="_blank"
                aria-label="Open the image link in a new tab."
                referrerPolicy="no-referrer"
                className="aspect-square w-full self-center "
            >
                <img
                    src={image.url}
                    loading="lazy"
                    alt={`Image you uploaded with the name ${image.name}`}
                    className="aspect-square w-full select-none rounded-t-md object-cover"
                />
            </a>
            <figcaption className="w-full cursor-default space-y-2 rounded-b-md border-t-2 border-periwinkle-100 p-2 dark:border-zinc-950 dark:text-periwinkle-50">
                <p
                    title={image.name}
                    className="line-clamp-1  self-center break-all rounded-b-md font-semibold"
                >
                    {image.name}
                </p>
                <p className="line-clamp-1 break-all rounded-b-md pr-1 text-right text-xs font-semibold italic opacity-80">
                    {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "long",
                    }).format(new Date(image.created_at))}
                </p>
            </figcaption>
            <button
                aria-label="Delete the album."
                onClick={handleDeleteImage}
                className="group absolute right-2 top-2 rounded-md bg-white p-2 shadow dark:bg-zinc-900"
            >
                <BsTrash
                    size={20}
                    className="fill-black group-hover:fill-red-500 dark:fill-white"
                />
            </button>
            {image.isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                    <LoadingSpinner color="white" size={56} />
                    <p className="text-center text-white">Uploading...</p>
                </div>
            )}
        </figure>
    );
};
