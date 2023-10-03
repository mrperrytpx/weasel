import { useQuery } from "@tanstack/react-query";
import { useUser } from "./useUser";
import { apiInstance } from "../utils/axiosClients";
import { TAllAlbums } from "../../../shared/types";

const fetchAlbums = async () => {
    const data = apiInstance.get<TAllAlbums[]>("/api/albums");
    return data;
};

export const useGetAllAlbumsQuery = () => {
    const user = useUser();

    return useQuery({
        queryKey: ["albums", user?.data?.id],
        queryFn: fetchAlbums,
    });
};
