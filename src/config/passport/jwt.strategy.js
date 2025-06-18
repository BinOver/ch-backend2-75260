import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { userService } from "../../services/user.services.js";
import "dotenv/config";

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      if (!jwt_payload) return done(null, false, { message: "Token inválido" });
      return done(null, jwt_payload);
    }
  )
);

const cookieExtractor = (req) => {
  return req?.cookies?.token || null;
};

passport.use(
  "jwt_cookies",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      if (!jwt_payload) return done(null, false, { message: "Token inválido" });
      try {
        const user = await userService.getById(jwt_payload._id);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getById(id);
    return done(null, user);
  } catch (error) {
    done(error);
  }
});
