import { userDao } from "../dao/user.dao.js";
import CustomError from "../utils/custom.error.js";
import { createHash, isValidPassword } from "../utils/user.utils.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import UserDTO from "../dto/user.dto.js";
import { sendWelcomeEmail } from "./email.services.js";

class UserService {
  constructor(dao) {
    this.dao = dao;
  }

  register = async (body) => {
    try {
      const { email, password } = body;
      const existUser = await this.dao.getByEmail(email);
      if (existUser) throw new CustomError("El usuario ya existe", 400);
      const response = await this.dao.create({
        ...body,
        password: createHash(password),
      });
      if (!response) throw new CustomError("Error al registrar usuario", 400);
      await sendWelcomeEmail(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  login = async (email, password) => {
    try {
      const userExist = await this.dao.getByEmail(email);
      if (!userExist) throw new CustomError("Credenciales incorrectas", 400);
      const passValid = isValidPassword(password, userExist.password);
      if (!passValid) throw new CustomError("Credenciales incorrectas", 400);
      return userExist;
    } catch (error) {
      throw error;
    }
  };

  getById = async (id) => {
    try {
      const user = await this.dao.getById(id);
      return new UserDTO(user);
    } catch (error) {
      throw error;
    }
  };

  generateToken = (user) => {
    const payload = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart?._id || user.cart,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "20m",
    });
  };
}

export const userService = new UserService(userDao);
