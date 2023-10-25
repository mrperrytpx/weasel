import { useParams } from "react-router-dom";
import { z } from "zod";
import { useGetPublicAlbumQuery } from "../hooks/useGetPublicAlbumQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";

const PublicAlbumPage = () => {
    const params = useParams();

    const albumId = z.string().parse(params.albumId);

    const publicAlbum = useGetPublicAlbumQuery(albumId);

    if (publicAlbum.isLoading)
        return (
            <div className="mx-auto mt-20 space-y-4 p-4">
                <LoadingSpinner color="#637ff1" size={60} />
                <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                    Loading album...
                </p>
            </div>
        );

    if (!publicAlbum.data)
        return (
            <div className="mx-auto mt-20 space-y-4 p-4">
                <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                    This album doesn't exist or isn't public! 😥
                </p>
            </div>
        );

    if (!publicAlbum.data.images.length)
        return (
            <div className="mx-auto mt-20 space-y-4 p-4">
                <p className="text-lg font-medium text-periwinkle-900 dark:text-white">
                    This album doesn't have any images yet! 😅
                </p>
            </div>
        );

    return <div>PublicAlbumPage</div>;
};

export default PublicAlbumPage;
