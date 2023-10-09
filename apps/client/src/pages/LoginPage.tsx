import { SocialMediaLoginButton } from "../components/SocialMediaLoginButton";
import { useCallback } from "react";
import WeaselImage from "../assets/weasel.png";
import { Link } from "react-router-dom";

const LoginPage = () => {
    const googleLogin = useCallback(() => {
        window.open(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, "_self");
    }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="mx-auto mt-4 flex w-full max-w-md flex-col items-center gap-8 p-8 md:mt-20">
                <div className="flex flex-col items-center gap-2">
                    <Link to="/">
                        <img
                            src={WeaselImage}
                            className="aspect-square w-16"
                            alt="A photo of a cartoonish weasel holding a black camera and resting his head on it, looking at the screen."
                        />
                    </Link>
                    <span className="text-2xl font-extrabold uppercase">Weasel Albums</span>
                </div>
                <div className="flex w-full flex-col gap-2">
                    <SocialMediaLoginButton
                        src="https://authjs.dev/img/providers/google.svg"
                        provider="Google"
                        signIn={googleLogin}
                    />
                    <SocialMediaLoginButton
                        src="https://authjs.dev/img/providers/google.svg"
                        provider="Google"
                        signIn={googleLogin}
                    />
                    <SocialMediaLoginButton
                        src="https://authjs.dev/img/providers/google.svg"
                        provider="Google"
                        signIn={googleLogin}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
