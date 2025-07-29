require("dotenv").config();
const { Strategy: LocalStrategy } = require("passport-local");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcrypt");
const User_details = require("../model/User_details");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(" JWT_SECRET is not defined in environment variables");
}

module.exports = (passport) => {
    //  Local Strategy - Login using email/password
    passport.use(
        new LocalStrategy(
            {
                usernameField: "user_email",  
                passwordField: "user_password"
            },
            async (user_email, user_password, done) => {
                try {
                    const normalizedEmail = user_email.toLowerCase();

                    const user = await User_details.findOne({
                        where: { user_email: normalizedEmail },
                    });

                    if (!user) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    const isMatch = await bcrypt.compare(user_password, user.user_password);
                    if (!isMatch) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    return done(null, user); 
                } catch (err) {
                    console.error(" LocalStrategy error:", err);
                    return done(err);
                }
            }
        )
    );

    //  JWT Strategy - Protecting routes with token
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: JWT_SECRET,
            },
            async (jwt_payload, done) => {
                try {
                    const user = await User_details.findByPk(jwt_payload.id);
                    if (!user) {
                        return done(null, false, { message: "User not found with this token" });
                    }
                    return done(null, user); 
                } catch (err) {
                    console.error(" JWTStrategy error:", err);
                    return done(err, false);
                }
            }
        )
    );
};
