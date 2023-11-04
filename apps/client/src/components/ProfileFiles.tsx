import { useGetFilesInfQuery } from "../hooks/useGetFilesInfQuery";
import { ProfileSubrouteLayout } from "../layouts/ProfileSubrouteLayout";
import { randomString } from "../utils/randomString";
import { Fragment } from "react";

export const ProfileFiles = () => {
    const infiniteFiles = useGetFilesInfQuery();

    return (
        <ProfileSubrouteLayout>
            <h1 className="text-center text-2xl font-bold md:text-left">Your Files</h1>
            {infiniteFiles.data?.pages.map((page) => (
                <Fragment key={randomString(6)}>
                    {page.files.map((file) => (
                        <div key={file.id}>
                            {file.id} - {file.album.name}
                        </div>
                    ))}
                </Fragment>
            ))}
        </ProfileSubrouteLayout>
    );
};
