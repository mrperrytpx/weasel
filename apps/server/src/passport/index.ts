import passport from "passport";
import { googlePassport } from "./googleStrategy";
import { prisma } from "@weasel/db";
import { TUser } from "@weasel/types";

declare global {
    namespace Express {
        interface User extends TUser {}
    }
}

class PassportStrategies {
    run() {
        this.serialize();
        this.deserialize();
        googlePassport();
    }

    serialize() {
        passport.serializeUser((user, done) => {
            return done(null, user.id);
        });
    }
    deserialize() {
        passport.deserializeUser(async (id: string, done: any) => {
            const dbUser = await prisma.user.findFirst({
                where: {
                    id,
                },
                select: {
                    id: true,
                    image: true,
                },
            });

            return done(null, dbUser);
        });
    }
}

const passportStrategies = new PassportStrategies();

export { passportStrategies };
