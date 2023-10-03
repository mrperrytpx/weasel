import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "../../../server/src/routers/albumRouter";

const fetchAlbums = async () => {
    const data = apiInstance.get<TAlbum[]>("/api/albums");
    return data;
};

export const useGetAllAlbumsQuery = () => {
    const user = useUser();

    return useQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: fetchAlbums,
    });
};
