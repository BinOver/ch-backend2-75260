import { userService } from "../services/user.services.js";
import UserDTO from "../dto/user.dto.js";

class UserController {
  constructor(service) {
    this.service = service;
  }

  register = async (req, res, next) => {
    try {
      //const response = await this.service.register(req.body);
      const userRegistered = await this.service.register(req.body);
      const response = new UserDTO(userRegistered);
      console.log(response);
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.service.login(email, password);
      const token = this.service.generateToken(user);
      const userSecureResponse = new UserDTO(user);
      // res.header("Authorization", token).json({ user, token });
      console.log(
        `El usuario con email: ${email} ha iniciado sesión con token: ${token}`
      );
      res
        .cookie("token", token, { httpOnly: true })
        .json({ userSecureResponse });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController(userService);
