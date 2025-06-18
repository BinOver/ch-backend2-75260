import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function decodeTokenNoLogin(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    //return res.status(401).send("No autorizado: token faltante");
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
}
