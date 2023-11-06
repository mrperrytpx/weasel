import { BsTrash } from "react-icons/bs";
import { useGetFilesInfQuery } from "../hooks/useGetFilesInfQuery";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { randomString } from "../utils/randomString";
import { roundBytesToKilobytes } from "../utils/roundBytesToKilobytes";
import { LoadingSpinner } from "./LoadingSpinner";
import { Fragment, useRef } from "react";
import { useDeleteImageMutation } from "../hooks/useDeleteImageMutation";
import { Link } from "react-router-dom";

type TDeleteFileButtonProps = {
    imageId: string;
    albumId: string;
};

const DeleteFileButton = ({ imageId, albumId }: TDeleteFileButtonProps) => {
    const deleteImage = useDeleteImageMutation();

    return (
        <button
            title="Delete the file."
            aria-label="Delete the file."
            onClick={async () => await deleteImage.mutateAsync({ imageId, albumId })}
            disabled={deleteImage.isLoading}
            className="group rounded-md bg-white p-2 disabled:opacity-50 dark:bg-zinc-800 dark:group-hover/tr:bg-zinc-700"
        >
            {deleteImage.isLoading ? (
                <LoadingSpinner size={20} color="#637ff1" />
            ) : (
                <BsTrash
                    size={20}
                    className="fill-black group-hover:fill-red-500 dark:fill-white  dark:group-hover:fill-red-500"
                />
            )}
        </button>
    );
};

export const ProfileFiles = () => {
    const infiniteFiles = useGetFilesInfQuery();
    const endRef = useRef<HTMLButtonElement>(null);

    return (
        <ProfileSubrouteLayout>
            <h1 className="text-center text-2xl font-bold md:text-left">Your Files</h1>
            {infiniteFiles.isLoading ? (
                <div className="flex flex-col gap-4">
                    <LoadingSpinner color="#637ff1" size={60} />
                    <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                        Loading files...
                    </p>
                </div>
            ) : !infiniteFiles.data?.pages[0]?.files.length ? (
                <div className="">
                    <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                        You haven't uploaded any files yet! 😅
                    </p>
                </div>
            ) : (
                <>
                    <table className="w-full max-w-5xl table-fixed overflow-x-scroll rounded-md bg-white dark:bg-zinc-800">
                        <thead className="w-full border-b-2 dark:border-zinc-700">
                            <tr className="w-full">
                                <th className="px-2 py-4 text-left">
                                    <div>Name</div>
                                </th>
                                <th className="px-2 py-4 text-left">
                                    <div>Album</div>
                                </th>

                                <th className="w-[5rem] px-2 py-4 text-left">
                                    <div>Size</div>
                                </th>
                                <th className="hidden w-[10rem] px-2 py-4 text-left sm:table-cell">
                                    <div>Date Uploaded</div>
                                </th>
                                <th className="w-[2.5rem] px-2 py-4 text-left" />
                            </tr>
                        </thead>
                        <tbody>
                            {infiniteFiles.data?.pages.map((page) => (
                                <Fragment key={randomString(6)}>
                                    {page.files.map((file) => (
                                        <tr
                                            className="group/tr border-b-2 last:border-none dark:border-zinc-700 dark:hover:bg-zinc-700"
                                            key={file.id}
                                        >
                                            <td className="truncate pl-2">
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    className="hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                                                >
                                                    {file.name}
                                                </a>
                                            </td>
                                            <td className="truncate pl-2">
                                                <Link
                                                    to={`/albums/${file.album.id}`}
                                                    className="hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                                                >
                                                    {file.album.name}
                                                </Link>
                                            </td>

                                            <td className="p-2 text-sm">
                                                <div className="">
                                                    {roundBytesToKilobytes(file.size)}KB
                                                </div>
                                            </td>
                                            <td className="hidden p-2 text-sm font-medium sm:table-cell">
                                                <div>
                                                    {new Intl.DateTimeFormat("en-GB", {
                                                        dateStyle: "long",
                                                    }).format(new Date(file.created_at))}
                                                </div>
                                            </td>
                                            <td>
                                                <DeleteFileButton
                                                    imageId={file.id}
                                                    albumId={file.album.id}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={() => infiniteFiles.fetchNextPage()}
                        disabled={!infiniteFiles.hasNextPage}
                        ref={endRef}
                        className="mb-4 pl-2 text-center text-sm font-bold disabled:hidden"
                    >
                        {infiniteFiles.hasNextPage
                            ? infiniteFiles.isFetchingNextPage
                                ? "Loading more files..."
                                : "Load more files"
                            : null}
                    </button>
                </>
            )}
        </ProfileSubrouteLayout>
    );
};
