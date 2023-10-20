import { z } from "zod";

export const albumNameSchema = z.object({
    name: z
        .string()
        .min(1, "Must be at least 1 character long.")
        .max(50, "Name can't exceed 50 characters"),
});

export type TCreateAlbumFormVals = z.infer<typeof albumNameSchema>;

export const filesFormSchema = z.object({
    files: typeof window === "undefined" ? z.any() : z.instanceof(FileList),
});

export type TUploadFilesFormVals = z.infer<typeof filesFormSchema>;

export type TUploadFileMutation = TUploadFilesFormVals & TUploadFilesInput;

export const uploadInputSchema = z.object({
    albumId: z.string().min(1, "Please provide an album ID!"),
    userId: z.string().min(1, "Please provide a user ID!"),
    fileSize: z
        .number()
        .min(1, "How are you even uploading files without a sizu???"),
});

export type TUploadFilesInput = z.infer<typeof uploadInputSchema>;
