import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "../../../shared/uploadthing";

// @ts-expect-error it's trolling idk, the longest typescript error of my life
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
