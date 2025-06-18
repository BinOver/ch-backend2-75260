import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendResetEmail } from "../utils/mailer.js";
import UserModel from "../dao/models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

export async function requestReset(req, res) {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).send("Usuario no encontrado");

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
  const link = `${
    process.env.FRONTEND_URL || "http://localhost:8080"
  }/reset/${token}`;

  await sendResetEmail(email, link);
  res.status(200).send("Correo de recuperacion enviado");
}

export async function resetPasswordForm(req, res) {
  const { token } = req.params;

  try {
    jwt.verify(token, JWT_SECRET);
    res.render("resetPassword", { token });
  } catch (err) {
    res.status(400).send("Token invalido o expirado");
  }
}

export async function submitNewPassword(req, res) {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).send("Usuario no encontrado");

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame)
      return res.status(400).send("La contrasenia es igual a la anterior");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.send("Constrasenia actualizada correctamente");
  } catch (err) {
    res.status(400).send("Toquen invalido o expirado. ", err);
  }
}
