import { useNavigate, useParams } from "react-router-dom";
import { useGetAlbumImagesQuery } from "../hooks/useGetAlbumImagesQuery";
import { z } from "zod";
import { useState } from "react";

const AlbumPage = () => {
    const [files, setFiles] = useState<File[]>([]);

    const params = useParams();
    const navigate = useNavigate();

    if (!params.albumId) navigate("/albums");
    const albumId = z.string().parse(params.albumId);
    const album = useGetAlbumImagesQuery(albumId);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            setFiles([...files, ...Array.from(selectedFiles)]);
        }
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
            <div className="mx-auto w-full max-w-screen-2xl flex-1 p-4">
                {album.data?.images.map((image) => (
                    <img key={image.id} src={image.address} alt="Image" />
                ))}
                <input type="file" multiple={true} onChange={handleFileChange} />
            </div>
        </div>
    );
};

export default AlbumPage;
