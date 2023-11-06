import { BsTrash } from "react-icons/bs";
import { useGetFilesInfQuery } from "../hooks/useGetFilesInfQuery";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { randomString } from "../utils/randomString";
import { roundBytesToKilobytes } from "../utils/roundBytesToKilobytes";
import { LoadingSpinner } from "./LoadingSpinner";
import { Fragment } from "react";
import { useDeleteImageMutation } from "../hooks/useDeleteImageMutation";

export const ProfileFiles = () => {
    const infiniteFiles = useGetFilesInfQuery();

    const deleteImage = useDeleteImageMutation();

    const handleDeleteAlbum = async (imageId: string, albumId: string) => {
        await deleteImage.mutateAsync({ imageId, albumId });
    };

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
                <table className="w-full rounded-md bg-white">
                    <thead className="border-b-2">
                        <tr>
                            <th className="text-left">
                                <div className="px-2 py-4">Name</div>
                            </th>
                            <th className="text-left">
                                <div className="px-2 py-4">Album</div>
                            </th>
                            <th className="text-left">
                                <div className="px-2 py-4">Date Uploaded</div>
                            </th>
                            <th className="text-left">
                                <div className="px-2 py-4">Size</div>
                            </th>
                            <th className="w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {infiniteFiles.data?.pages.map((page) => (
                            <Fragment key={randomString(6)}>
                                {page.files.map((file) => (
                                    <tr key={file.id}>
                                        <td>
                                            <div className="line-clamp-1 p-2">{file.name}</div>
                                        </td>
                                        <td>
                                            <div className="line-clamp-1 p-2">
                                                {file.album.name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="p-2">
                                                {new Intl.DateTimeFormat("en-GB", {
                                                    dateStyle: "long",
                                                }).format(new Date(file.created_at))}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="p-2">
                                                {roundBytesToKilobytes(file.size)}KB
                                            </div>
                                        </td>
                                        <td className="w-min">
                                            <button
                                                aria-label="Delete the file."
                                                onClick={() =>
                                                    handleDeleteAlbum(file.id, file.album.id)
                                                }
                                                className="group w-min rounded-md bg-white p-2 dark:bg-zinc-800"
                                            >
                                                <BsTrash
                                                    size={20}
                                                    className="fill-black group-hover:fill-red-500 dark:fill-white"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </ProfileSubrouteLayout>
    );
};
