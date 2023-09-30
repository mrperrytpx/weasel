import { apiInstance } from "./utils/axiosClients";
import { useQuery } from "@tanstack/react-query";

function App() {
    const helloWorldQuery = useQuery({
        queryKey: ["yo"],
        queryFn: async () => {
            const data = await apiInstance.get("/api/hello");
            return data.data;
        },
    });

    return (
        <div className="mx-auto mb-2 mt-4 flex w-full max-w-screen-md flex-col items-start gap-2 px-2 lg:gap-6">
            <p>Server data is below me:</p>
            {helloWorldQuery.isLoading && <p>Loading...</p>}
            {helloWorldQuery.data && <p>{JSON.stringify(helloWorldQuery.data, null, 2)}</p>}
        </div>
    );
}

export default App;
