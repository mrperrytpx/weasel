import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@weasel/filehost";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
