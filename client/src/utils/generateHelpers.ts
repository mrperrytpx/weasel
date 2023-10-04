import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "../../../shared/uploadthing";

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
