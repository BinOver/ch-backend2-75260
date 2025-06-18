import { configMail, transporter } from "../services/email.services.js";

export const sendMailEth = async (req, res, next) => {
  try {
    const response = await transporter.sendMail(configMail);
    res.json(response);
  } catch (error) {
    next(error);
  }
};
