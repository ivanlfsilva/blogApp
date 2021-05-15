// chamam o express e o Router
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

// organização as rotas
router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Página das postagens");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .then((categorias) => {
      res.render("admin/categorias", {
        categorias: categorias.map((categorias) => categorias.toJSON()),
      });
    })
    .catch(() => {
      res.flash("error_msg", "houve um erro a carregar as categorias");
      res.redirect("/admin");
    });
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido =:(" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "Slug inválido =:(" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  }

  const novaCategoria = {
    nome: req.body.nome,
    slug: req.body.slug,
  };

  new Categoria(novaCategoria)
    .save()
    .then(() => {
      req.flash("success_msg", "categoria criada com sucesso! :)");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro ao salvar a categoria :(");
      res.redirect("/admin");
    });
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .lean()
    .then((categoria) => {
      res.render("admin/editcategorias", { categoria: categoria });
    })
    .catch(() => {
      res.flash("error_msg", "esta categoria não exite");
      res.redirect("/admin/categorrias");
    });
});

module.exports = router;
