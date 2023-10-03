import AlbumCard from "../components/AlbumCard";
import { useGetAllAlbumsQuery } from "../hooks/useGetAllAlbumsQuery";
import { LoadingSpinner } from "../components/LoadingSpinner";

const AlbumsPage = () => {
    const userAlbums = useGetAllAlbumsQuery();

    // if (userAlbums.data) {
    //     userAlbums.data?.data.forEach((album) => {
    //         queryClient.setQueryData<TAlbum>(["album", album.id], {...album});
    //     });
    // }

    return (
        <div className="flex flex-1 flex-col gap-2">
            <ul className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-wrap justify-center gap-6 p-4 lg:justify-start lg:gap-12">
                {userAlbums.isLoading ? (
                    <div className="flex w-full items-center justify-center ">
                        <LoadingSpinner size={60} />
                    </div>
                ) : userAlbums.data?.length ? (
                    userAlbums.data.map((album) => <AlbumCard key={album.id} album={album} />)
                ) : (
                    <div className="flex w-full items-center justify-center">No bitches 💀</div>
                )}
            </ul>
        </div>
    );
};

export default AlbumsPage;
