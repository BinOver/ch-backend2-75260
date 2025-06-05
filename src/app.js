import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import routerProd from "./routes/products.route.js";
import routerCarts from "./routes/carts.routes.js";
import routerViews from "./routes/views.router.js";
/* import { ProductManager } from "./dao/fs/ProductManager.js"; */
import ProductManager from "../misc/ProductManager-db.js";
import "./database.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import routerSessions from "./routes/sessions.routers.js";
import dotenv from "dotenv";
import passport from "passport";
import "./config/passport/jwt.strategy.js";
import cookieParser from "cookie-parser";
import routerEmail from "./routes/email.routes.js";
import routerPassword from "./routes/password.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
//

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
    secret: process.env.DB_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//Passport
app.use(passport.initialize());
//app.use(passport.session());
//

//Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Routes api
app.use("/api/products", routerProd);
app.use("/api/carts", routerCarts);
app.use("/api/email", routerEmail);
/////Sessions
app.use("/api/sessions", routerSessions);

//Routes Views
app.use("/", routerViews);

//Reset Passord
app.use("/api/password", routerPassword);

//Server (referencia)
const httpServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

//
const productManager = new ProductManager();
// instacia de Socket.io
const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Se conecto un cliente.");
  // Enviamos array de productos
  socket.emit("products", await productManager.getProducts());
  // Recibimos "deletProduct" desde el cliente
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);
    // Envio lista actualizada al cliente
    io.sockets.emit("products", await productManager.getProducts());
  });
  // Envio lista actualizada al cliente
  io.sockets.emit("products", await productManager.getProducts());
  // Recibimos "addProduct" desde el cliente
  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);
    console.log(product);
    // Envio lista actualizada al cliente
    io.sockets.emit("products", await productManager.getProducts());
  });
});
