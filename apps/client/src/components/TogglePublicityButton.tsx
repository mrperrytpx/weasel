import { useParams } from "react-router-dom";
import { useUpdateAlbumPublicityMutation } from "../hooks/useUpdateAlbumPublicityMutation";
import { z } from "zod";
import { useState } from "react";
import { useGetAlbumQuery } from "../hooks/useGetAlbumQuery";

export const TogglePublicityButton = () => {
    const params = useParams();
    const { data: albumId } = z.string().safeParse(params.albumId) as Zod.SafeParseSuccess<string>;

    const updateAlbumPublicity = useUpdateAlbumPublicityMutation();
    const album = useGetAlbumQuery(albumId);

    const [checked, setChecked] = useState<boolean | undefined>(album.data?.isPublic);

    const handleInputChecked = async () => {
        setChecked((old) => !old);
        await updateAlbumPublicity.mutateAsync({ albumId });
    };

    if (!album.data) return null;

    return (
        <div className="group relative flex items-center gap-1">
            <input
                onChange={handleInputChecked}
                disabled={updateAlbumPublicity.isLoading}
                checked={checked}
                type="checkbox"
                id="switch"
                role="switch"
                className="relative h-6 w-12 cursor-pointer appearance-none rounded-full bg-white ring-1 ring-transparent ring-offset-white transition-colors duration-200 ease-in-out before:absolute before:left-0 before:top-0 before:inline-block before:h-6 before:w-6 before:rounded-full before:bg-periwinkle-600 before:shadow before:ring-0 before:transition-all before:duration-200 checked:bg-periwinkle-400 checked:before:left-full checked:before:-translate-x-full checked:before:bg-periwinkle-600 disabled:opacity-50 dark:bg-zinc-700 dark:before:bg-periwinkle-400 dark:checked:bg-periwinkle-400 dark:checked:before:bg-periwinkle-600 "
            />
            <label className="cursor-pointer text-right" htmlFor="switch">
                {album.data.isPublic ? "Public" : "Private"}
            </label>
            <div
                role="tooltip"
                className="absolute bottom-full left-1/2 z-[100] inline-block w-max max-w-[12rem] -translate-x-1/2 -translate-y-2 rounded-lg bg-zinc-900 px-3 py-2 text-center text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-75 group-hover:opacity-100 dark:bg-zinc-700"
            >
                Album is set to {album.data.isPublic ? "public." : "private."}
                <div className="absolute left-1/2 top-full -mt-px h-0 w-0 -translate-x-1/2 border-8 border-solid border-transparent border-t-black" />
            </div>
        </div>
    );
};
