import { z } from "zod";

export const albumNameSchema = z.object({
    name: z
        .string()
        .min(1, "Must be at least 1 character long.")
        .max(50, "Name can't exceed 50 characters"),
    description: z
        .string()
        .min(2, "Must be at least 2 characters long.")
        .max(500, "Description cann't exceed 500 characters"),
});

export type TCreateAlbumFormVals = z.infer<typeof albumNameSchema>;
