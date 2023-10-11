import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateAlbumMutation } from "../hooks/useCreateAlbumMutation";
import { TCreateAlbumFormVals, albumNameSchema } from "@weasel/schemas";
import { useNavigate } from "react-router-dom";

const CreateAlbumPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TCreateAlbumFormVals>({
        resolver: zodResolver(albumNameSchema),
    });

    const createAlbum = useCreateAlbumMutation();

    const onSubmit: SubmitHandler<TCreateAlbumFormVals> = async (data) => {
        const response = await createAlbum.mutateAsync({ ...data });
        if (response.id) {
            navigate("/albums");
        }
    };

    return (
        <div className="p-4">
            <div className="mx-auto mt-4 max-w-screen-sm md:mt-20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div>
                        <input
                            aria-label="Album name."
                            {...register("name")}
                            className="w-full rounded-lg p-4 text-center text-lg font-semibold shadow focus:outline-periwinkle-600 dark:text-periwinkle-950 md:text-xl"
                            placeholder="Album name..."
                            type="text"
                            maxLength={50}
                            minLength={1}
                        />
                        {errors.name && (
                            <span className="pl-1 text-xs font-semibold text-red-500">
                                {errors.name.message}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <textarea
                            aria-label="Album description."
                            {...register("description")}
                            className="min-h-[8rem] w-full rounded-lg p-4 font-semibold shadow focus:outline-periwinkle-600 dark:text-periwinkle-950 md:text-lg"
                            placeholder="Describe your album..."
                            maxLength={500}
                            minLength={1}
                        />
                        {errors.description && (
                            <span className="pl-1 text-xs font-semibold text-red-500">
                                {errors.description.message}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={createAlbum.isLoading}
                        className="w-full rounded-lg bg-white p-4 text-center text-lg font-medium shadow transition-colors duration-75 enabled:hover:bg-periwinkle-600 enabled:hover:text-periwinkle-50 enabled:focus:outline-periwinkle-600 disabled:opacity-50 dark:text-periwinkle-950 enabled:dark:hover:text-periwinkle-50 md:text-xl"
                    >
                        {createAlbum.isLoading ? "Creating your album..." : "Create!"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAlbumPage;
