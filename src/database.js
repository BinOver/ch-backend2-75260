import mongoose from "mongoose";
import "dotenv/config";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Conectado a la base de datos"))
  .catch(
    (error) => "Error en la conexion con la base de datos " + error.message
  );
