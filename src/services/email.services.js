import { createTransport } from "nodemailer";
import "dotenv/config";

export const transporter = createTransport({
  host: process.env.HOST_MAIL,
  port: process.env.PORT_MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

export const configMail = {
  form: process.env.USER_MAIL,
  to: process.env.USER_MAIL_DEST,
  subject: "Bienvenido/a",
  text: "Te damos la bienvenida, muchas gracias por registrarte",
};

export const sendWelcomeEmail = async (toEmail) => {
  try {
    await transporter.sendMail({
      from: process.env.USER_MAIL,
      to: toEmail,
      subject: "Bienvenido/a",
      text: "Te damos la bienvenida, muchas gracias por registrarte",
    });
  } catch (err) {
    console.error("❌ Error enviando email:", err.message);
  }
};
