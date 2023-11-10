import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateAlbumMutation } from "../hooks/useCreateAlbumMutation";
import { useNavigate } from "react-router-dom";
import { TCreateAlbumFormVals, albumNameSchema } from "@weasel/schemas";

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
        <main className="p-4">
            <div className="mx-auto mt-4 max-w-responsive-screen-sm md:mt-20">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <input
                        aria-label="Album name."
                        {...register("name")}
                        className="w-full rounded-lg p-4 text-center text-lg font-semibold shadow focus:outline-periwinkle-600 dark:bg-zinc-800 dark:text-white md:text-xl"
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

                    <button
                        type="submit"
                        disabled={createAlbum.isLoading}
                        className="w-full rounded-lg bg-white p-4 text-center text-lg font-medium shadow transition-colors duration-75 enabled:hover:bg-periwinkle-600 enabled:hover:text-periwinkle-50 enabled:focus:outline-periwinkle-600 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-800 dark:text-white md:text-xl"
                    >
                        {createAlbum.isLoading ? "Creating your album..." : "Create!"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default CreateAlbumPage;
