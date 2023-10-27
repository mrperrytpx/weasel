type TProfileSubrouteLayoutProps = {
    children: React.ReactNode;
};

export const ProfileSubrouteLayout = ({ children }: TProfileSubrouteLayoutProps) => {
    return (
        <main className="space-y-4 dark:border-l-zinc-600 md:border-l-2 md:border-l-periwinkle-300 md:pl-4">
            {children}
        </main>
    );
};
