import { useDeleteUserMutation } from "../hooks/useDeleteUserMutation";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";

export const ProfileSettings = () => {
    const deleteUser = useDeleteUserMutation();

    return (
        <ProfileSubrouteLayout>
            <h1 className="text-center text-2xl font-bold md:text-left">Setting</h1>
            <button
                className="min-w-[10rem] rounded-md bg-white p-2 font-medium disabled:opacity-50"
                disabled={deleteUser.isLoading}
                onClick={() => deleteUser.mutate()}
            >
                {deleteUser.isLoading ? "Goodbye" : "Delete"}
            </button>
        </ProfileSubrouteLayout>
    );
};
