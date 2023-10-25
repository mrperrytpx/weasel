import { generateReactHelpers } from "@uploadthing/react/hooks";
import { OurFileRouter } from "@weasel/types";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
