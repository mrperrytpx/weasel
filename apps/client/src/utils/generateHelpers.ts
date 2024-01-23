import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@weasel/types";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>({
    url: import.meta.env.VITE_SERVER_URL + "/api/uploadthing",
});
