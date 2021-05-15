// Carregando os módulos
const express = require("express");
const expressHandlebars = require("express-handlebars");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

// Configurações
// session
app.use(
  session({
    secret: "curso de nodejs",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
// middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});
// body-parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// handlebars
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/blogapp")
  .then(() => {
    console.log("conectado com sucesso!");
  })
  .catch((e) => {
    console.log("algo deu errado ao conectar ao mongodb :( " + e);
  });
// public
app.use(express.static(path.join(__dirname, "public")));
// Rotas
app.use("/admin", admin);
// Outros
var PORT = 8081;
app.listen(PORT, () => {
  console.log("server run!");
});
