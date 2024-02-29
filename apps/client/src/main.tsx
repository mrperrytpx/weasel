import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContextProvider } from "./contexts/UserContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SuspenseRouter from "./utils/SuspenseRouter.tsx";
import { LoadingSpinner } from "./components/LoadingSpinner.tsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SuspenseRouter window={window}>
            <Suspense fallback={<LoadingSpinner size={40} />}>
                <QueryClientProvider client={queryClient}>
                    <UserContextProvider>
                        <App />
                        <ReactQueryDevtools initialIsOpen={false} />
                    </UserContextProvider>
                </QueryClientProvider>
            </Suspense>
        </SuspenseRouter>
    </React.StrictMode>,
);
