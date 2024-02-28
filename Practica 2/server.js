const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/heroes');

// Definir el esquema de los héroes
const HeroeSchema = new mongoose.Schema({
  nombre: String,
  poder: String,
  descripcion: String
});

const Heroe = mongoose.model('Heroe', HeroeSchema);

//MQL
//Heroe.collection.insertOne({ nombre: "Hulk", poder: "Ira", descripcion: "Se vuelve grande y verde" });
//Heroe.collection.insertOne({ nombre: "Iron man", poder: "Dinero", descripcion: "Se ha hecho un traje muy chulo" });
//Heroe.collection.insertOne({ nombre: "Flash", poder: "Velocidad", descripcion: "Va muy rapido" });
//Heroe.collection.insertOne({ nombre: "Capitan america", poder: "Capitalismo", descripcion: "Tiene un escudo" });

app.get('/', (req, res) => {
  Heroe.find()
    .then(heroes => {
      var html = '<h1>Héroes de Marvel</h1><ul>';
      heroes.forEach(heroe => {
        html += `<li><strong>${heroe.nombre}</strong>: ${heroe.descripcion}, Poder: ${heroe.poder}</li>`;
      });
      html += '</ul>';
      res.send(html);
    })
    .catch(err => {
      console.error('Error al obtener los héroes:', err);
      res.status(500).send('Error interno del servidor');
    });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor Express iniciado en el puerto 3000');
});