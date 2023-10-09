import { Profile, Strategy } from "passport-google-oauth20";
import passport from "passport";
import type { User } from "@prisma/client";
import { prisma } from "@weasel/db";

export type TUser = Pick<User, "id" | "image">;

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
                    },
                });

                if (!user) {
                    const newUser = await prisma.user.create({
                        data: {
                            id: profile.id,
                            email: profile._json.email,
                            image: profile._json.picture,
                        },
                    });

                    const newUserData = {
                        id: newUser.id,
                        image: newUser.image,
                    };

                    return cb(null, newUserData);
                }

                return cb(null, user);
            }
        )
    );

export { googlePassport };
