type TSocialMediaLoginButtonProps = {
    provider: string;
    signIn: () => void;
    src: string;
};

export const SocialMediaLoginButton = ({ provider, signIn, src }: TSocialMediaLoginButtonProps) => {
    return (
        <button
            aria-label={`${provider} sign in.`}
            className="group flex w-full items-center justify-center gap-2 rounded-lg border-2 bg-white text-sm text-black transition-all duration-75 hover:border-[#4285F4] hover:bg-[#4285F4]"
            onClick={() => signIn()}
        >
            <div className="rounded-sm bg-white p-2">
                <img className="aspect-square w-[1.125rem]" src={src} alt={`${provider}'s logo`} />
            </div>
            <span className="pr-2 font-medium group-hover:text-white">Sign in with {provider}</span>
        </button>
    );
};
