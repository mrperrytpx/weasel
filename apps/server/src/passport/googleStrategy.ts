import { Profile, Strategy } from "passport-google-oauth20";
import passport from "passport";
import { prisma } from "@weasel/db";
import { stripe } from "../lib/stripe";
import { randomString } from "../utils/randomString";

const googlePassport = () =>
    passport.use(
        new Strategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID as string,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                callbackURL: "/api/auth/callback/google",
            },
            async (_accTkn: string, _refrTkn: string, profile: Profile, cb) => {
                const user = await prisma.user.findFirst({
                    where: {
                        id: profile.id,
                    },
                    select: {
                        id: true,
                        image: true,
                        isSubscriptionActive: true,
                    },
                });

                if (!user) {
                    const stripeCustomer = await stripe.customers.create({
                        name: `${profile.id}-${randomString(10)}`,
                        metadata: {
                            id: profile.id,
                        },
                    });

                    const newUser = await prisma.user.create({
                        data: {
                            id: profile.id,
                            email: profile._json.email,
                            image: profile._json.picture,
                            customerId: stripeCustomer.id,
                        },
                    });

                    const newUserData = {
                        id: newUser.id,
                        image: newUser.image,
                        isSubscriptionActive: newUser.isSubscriptionActive,
                    };

                    return cb(null, newUserData);
                }

                return cb(null, user);
            }
        )
    );

export { googlePassport };
