import passport from "passport";
import { googlePassport } from "./googleStrategy";

class PassportStrategies {
    run() {
        this.serialize();
        this.deserialize();
        googlePassport();
    }

    serialize() {
        passport.serializeUser((user: any, done: any) => {
            // whole user model from DB
            return done(null, user);
        });
    }
    deserialize() {
        passport.deserializeUser((user: any, done: any) => {
            // whatever comes from frontend
            return done(null, user);
        });
    }
}

const passportStrategies = new PassportStrategies();

export { passportStrategies };
