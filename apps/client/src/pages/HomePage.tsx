import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { PricingCard } from "../components/PricingCard";
import WeaselAlbumsBig from "../assets/weasel-albums-big.webp";
import WeaselAlbumsSmall from "../assets/weasel-albums-small.webp";
import WeaselAlbumsMedium from "../assets/weasel-albums-medium.webp";
import WeaselSharingSmall from "../assets/weasel-sharing-small.webp";
import WeaselSharingMedium from "../assets/weasel-sharing-medium.webp";
import WeaselSharingBig from "../assets/weasel-sharing-big.webp";

const HomePage = () => {
    return (
        <div className="flex flex-1 flex-col justify-between">
            <main className="mx-auto min-h-[min(calc(90dvh),56rem)] w-full max-w-responsive-screen-2xl px-4">
                <section className="flex min-h-[inherit] flex-col items-center justify-center gap-8">
                    <h1 className="text-center text-4xl font-semibold">Capture. Collect. Keep.</h1>
                    <Link
                        className="flex w-full max-w-[12rem] select-none items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-center text-lg font-semibold shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:bg-zinc-800 dark:text-white hover:dark:bg-periwinkle-600 dark:hover:text-periwinkle-50"
                        to="/albums"
                    >
                        Let's Begin
                    </Link>
                </section>
                <section className="mx-auto mb-32 flex max-w-xl flex-col items-center justify-start text-center">
                    <picture>
                        <source media="(min-width:64rem)" srcSet={WeaselAlbumsBig} />
                        <source media="(min-width:40rem)" srcSet={WeaselAlbumsMedium} />
                        <img
                            src={WeaselAlbumsSmall}
                            className="select-none"
                            alt="An orange weasel looking out of the frame to the right, sitting inside of a cover of a photo album. The album has brown covers and a picture of a mountain."
                        />
                    </picture>
                    <div className="space-y-8">
                        <h2 className="text-4xl">Access memorable moments, any time, any where</h2>
                        <p>
                            Securely back-up your photos and enjoy them from{" "}
                            <span className="underline">any</span> device.
                        </p>
                    </div>
                </section>
                <section className="mx-auto mb-32 flex max-w-xl flex-col items-center justify-start gap-4 text-center">
                    <picture>
                        <source media="(min-width:64rem)" srcSet={WeaselSharingBig} />
                        <source media="(min-width:40rem)" srcSet={WeaselSharingMedium} />
                        <img
                            src={WeaselSharingSmall}
                            className="select-none"
                            alt="A bigger orange weasel holding a photo album, telling stories to a smaller weasel which doesn't have hands."
                        />
                    </picture>
                    <div className="space-y-8">
                        <h2 className="text-4xl">Share your memories</h2>
                        <p>
                            Easily share photos and albums with friends and family - it's only one
                            link away!
                        </p>
                    </div>
                </section>
                <section className="mb-32 flex w-full flex-col items-center justify-center gap-8 text-center md:mb-40 md:gap-16">
                    <h2 className="text-4xl">Our Pricing</h2>
                    <div className="grid grid-rows-2 gap-8 md:grid-cols-3 md:grid-rows-none md:gap-16">
                        <PricingCard />
                        <PricingCard plan="premium" />
                        <PricingCard plan="ultimate" />
                    </div>
                </section>
                <section className="mb-20 flex flex-col items-center justify-center gap-8 py-32 text-center md:mb-40">
                    <h2 className="text-4xl">Start saving memories today!</h2>
                    <Link
                        className="flex w-full max-w-[12rem] select-none items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 text-center text-lg font-semibold shadow transition-colors duration-75 hover:bg-periwinkle-600 hover:text-periwinkle-50 focus:outline-periwinkle-600 dark:bg-zinc-800 dark:text-white hover:dark:bg-periwinkle-600 dark:hover:text-periwinkle-50"
                        to="/albums"
                    >
                        Let's Begin
                    </Link>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
