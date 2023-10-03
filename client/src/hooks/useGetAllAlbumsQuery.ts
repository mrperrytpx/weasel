import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TAlbum } from "../../../shared/types";

const fetchAlbums = async () => {
    const data = await apiInstance.get<TAlbum[]>("/api/albums");
    return data.data;
};

export const useGetAllAlbumsQuery = () => {
    const user = useUser();

    return useQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: fetchAlbums,
    });
};
