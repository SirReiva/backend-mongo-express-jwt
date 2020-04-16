import passport, { AuthenticateOptions } from 'passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config';
import User from '../../schemas/user.schema';


const opts: AuthenticateOptions = {
    session: false
};

export const PassportGuard = () => passport.authenticate('jwt', opts);

const strategyOpts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWTSECRET
};

export default new Strategy(strategyOpts, async (payload, done) => {
    try {
        const user = User.findById(payload.id);
        if (user) return done(null, user);
        return done(null, false);
    } catch (error) {
        console.log(error);
    }
});