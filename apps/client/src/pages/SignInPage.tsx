import { SocialMediaSignInButton } from "../components/SocialMediaSignInButton";
import { useCallback } from "react";
import PlayfulWeaselImage from "../assets/playful-weasel.webp";
import { Link } from "react-router-dom";

const SignInPage = () => {
    const googleSignIn = useCallback(() => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, "_self");
    }, []);

    return (
        <main className="flex items-center justify-center">
            <div className="mx-auto mt-4 flex w-full max-w-md flex-col items-center gap-4 p-8">
                <Link className="aspect-square w-full max-w-sm" to="/">
                    <img
                        src={PlayfulWeaselImage}
                        alt="A photo of a cartoonish weasel holding a black camera and resting his head on it, looking at the screen."
                    />
                </Link>
                <div className="flex w-full flex-col gap-2">
                    <SocialMediaSignInButton
                        src="https://authjs.dev/img/providers/google.svg"
                        provider="Google"
                        signIn={googleSignIn}
                    />
                </div>
            </div>
        </main>
    );
};

export default SignInPage;
