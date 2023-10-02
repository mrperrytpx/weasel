import { useParams } from "react-router-dom";

const AlbumPage = () => {
    const params = useParams();

    return <div>AlbumPage {params.albumId}</div>;
};

export default AlbumPage;
