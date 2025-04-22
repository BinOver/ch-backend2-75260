import passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { userService } from "../../services/user.services.js";
import "dotenv/config";

const strategyConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const verifyToken = async (jwt_payload, done) => {
  if (!jwt_payload) return done(null, false, { messages: "Invalid Token" });
  return done(null, jwt_payload);
};

passport.use("jwt", new Strategy(strategyConfig, verifyToken));

const cookieExtractor = (req) => {
  return req.cookies.token;
};

const strategyConfigCookies = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use("jwt-cookies", new Strategy(strategyConfigCookies, verifyToken));

passport.serializeUser((user, done) => {
  try {
    done(null, user._id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getById(id);
    return done(null, user);
  } catch (error) {
    done(error);
  }
});
