import {Strategy, ExtractJwt} from 'passport-jwt';
import * as passport from "passport";
import * as dotenv from 'dotenv';
import * as path from 'path';

import {User} from '../models/user';

/**
 * passport jwt configuration
 */
export class PassportConfig {
    // public passport: passport;

    constructor(passport: any) {
        // this.passport = passport;
        dotenv.config({path: path.resolve(__dirname, './../../.env.example')});
    }

    public init() {
        let opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.APPLICATION_SECRET
        };

        passport.use(new Strategy(opts, (jwtPayload, done) => {
            User.findOne({_id: jwtPayload._doc._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}
