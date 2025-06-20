import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function decodeToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("No autorizado: token faltante");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send("Token inválido");
  }
  next();
}
