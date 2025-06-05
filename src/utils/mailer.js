import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.HOST_MAIL,
  port: process.env.PORT_MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
});

export async function sendResetEmail(to, link) {
  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Recuperacion de contrasenia",
    html: `<p> A continuacion se encuentra el enlace para reestablecer su contrasenia</p>
            <a href="${link}" style="padding:10px 20px; background:#555; color:#fff; text-decoration:none; border-radius:8px;">Restablecer contraseña</a>`,
  });
}
