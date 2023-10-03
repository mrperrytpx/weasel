import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { z } from "zod";

const AlbumPage = () => {
    const params = useParams();
    const navigate = useNavigate();

    if (!params.albumId) navigate("/albums");

    const albumId = z.string().parse(params.albumId);

    const albumImages = useGetAlbumImagesQuery(albumId);

    return (
        <div className="flex flex-1 flex-col">
            <div className="mx-auto w-full max-w-screen-2xl flex-1 bg-red-200 p-4">
                {JSON.stringify(albumImages.data?.data, null, 2)}
            </div>
        </div>
    );
};

export default AlbumPage;
