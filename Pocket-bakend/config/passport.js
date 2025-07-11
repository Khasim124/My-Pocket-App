const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const { User_details } = require("../model/User_details");

const JWT_SECRET = "my_hardcoded_jwt_secret";

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField: "user_email",
        passwordField: "user_password"
    }, async (email, password, done) => {
        try {
            const user = await User_details.findOne({ where: { user_email: email.toLowerCase() } });
            if (!user) return done(null, false, { message: "Invalid email or password" });

            const isMatch = await bcrypt.compare(password, user.user_password);
            if (!isMatch) return done(null, false, { message: "Invalid email or password" });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET
    }, async (payload, done) => {
        try {
            const user = await User_details.findByPk(payload.id);
            return user ? done(null, user) : done(null, false, { message: "Token user not found" });
        } catch (err) {
            return done(err, false);
        }
    }));
};
