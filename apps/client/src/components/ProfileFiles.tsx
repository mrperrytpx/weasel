import { BsTrash } from "react-icons/bs";
import { useGetFilesInfQuery } from "../hooks/useGetFilesInfQuery";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { randomString } from "../utils/randomString";
import { convertBytesToPalletableSize } from "../utils/convertBytesToPalletableSize";
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
            className="group rounded-md bg-white p-4 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-800 dark:group-hover/tr:bg-zinc-700"
        >
            {deleteImage.isLoading ? (
                <LoadingSpinner size={16} color="#637ff1" />
            ) : (
                <BsTrash
                    size={16}
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
            ) : !infiniteFiles.data?.pages.reduce((acc, curr) => acc + curr.files.length, 0) ? (
                <div className="">
                    <p className="text-center text-lg font-medium text-periwinkle-900 dark:text-white">
                        You haven't uploaded any files yet! 😅
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-full max-w-5xl overflow-x-auto">
                        <table className="w-full  rounded-md bg-white dark:bg-zinc-800">
                            <thead className="border-b-2 dark:border-zinc-700">
                                <tr>
                                    <th className="p-4 text-left">
                                        <div>Name</div>
                                    </th>
                                    <th className="p-4 text-left">
                                        <div>Album</div>
                                    </th>

                                    <th className="w-[7.5rem] p-4 text-left">
                                        <div>Size</div>
                                    </th>
                                    <th className="table-cell w-[7.5rem] p-4 text-left">
                                        <div>Date</div>
                                    </th>
                                    <th className="w-[2.5rem] p-2 text-left" />
                                </tr>
                            </thead>
                            <tbody>
                                {infiniteFiles.data?.pages.map((page) => (
                                    <Fragment key={randomString(6)}>
                                        {page.files.map((file) => (
                                            <tr
                                                className="group/tr w-full border-b-2 last:border-none dark:border-zinc-700 dark:hover:bg-zinc-700"
                                                key={file.id}
                                            >
                                                <td className="truncate pl-4">
                                                    <a
                                                        href={file.url}
                                                        target="_blank"
                                                        className="hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                                                    >
                                                        {file.name}
                                                    </a>
                                                </td>
                                                <td className="truncate pl-4">
                                                    <Link
                                                        to={`/albums/${file.album.id}`}
                                                        className="hover:text-periwinkle-600 hover:underline dark:hover:text-periwinkle-400"
                                                    >
                                                        {file.album.name}
                                                    </Link>
                                                </td>

                                                <td className="px-4 py-2 text-sm">
                                                    <div className="">
                                                        {convertBytesToPalletableSize(file.size)}
                                                    </div>
                                                </td>
                                                <td className="table-cell px-4 py-2 text-sm font-medium">
                                                    <div>
                                                        {new Intl.DateTimeFormat("en-GB", {
                                                            dateStyle: "short",
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
                    </div>
                    <button
                        onClick={() => infiniteFiles.fetchNextPage()}
                        disabled={!infiniteFiles.hasNextPage}
                        ref={endRef}
                        className="mb-4 pl-4 text-center text-sm font-bold disabled:pointer-events-none disabled:opacity-50"
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
