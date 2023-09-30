import { Strategy } from "passport-google-oauth20";
import passport from "passport";
// import { type User } from "@prisma/client";

const googlePassport = () =>
    passport.use(
        new Strategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:3001/api/auth/callback/google",
            },
            function (_accTkn: string, _refrTkn: string, profile: any, cb) {
                return cb(null, profile);
            }
        )
    );

export { googlePassport };
