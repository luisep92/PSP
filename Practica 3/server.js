const express = require('express');
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/practica3');

let libroSchema = new mongoose.Schema({
    titulo: String,
    autor: [String],
    ejemplares: Number
    });
let Libro = mongoose.model('libros', libroSchema);
let app = express();
app.listen(8080)
