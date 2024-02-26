const express = require('express');
const mongoose = require("mongoose");
const url = require("url");

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/practica3');

// Definir el esquema del libro
let libroSchema = new mongoose.Schema({
    titulo: String,
    autor: [String],
    ejemplares: Number
});

// Crear el modelo de Libro
let Libro = mongoose.model('libros', libroSchema);

// Crear una aplicación Express
let app = express();
app.use(express.json());

// Get all books
app.get('/libros', (req, res) => {
    Libro.find().then(result => {
        res.send(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener libros');
    });
});

// Get books filter: autor contains an string that contains the content of searchString. Ejemplares must be less than maxEjemplares
app.get('/libros/filter/:autor/:ejemplares', (req, res) => {
    const searchString = req.params.autor; 
    const maxEjemplares = parseInt(req.params.ejemplares);
    Libro.find({ autor: { $regex: searchString, $options: 'i'}, 
                 ejemplares: { $lt: maxEjemplares } })
        .then(result => {
            res.send(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error al obtener libros');
    });
});

// Get book by ID
app.get('/libros/:id', (req, res) => {
    const libroId = req.params.id; // Obtener el ID de la ruta
    // Buscar el libro por su ID
    Libro.findById(libroId)
        .then(libro => {
            if (libro) {
                res.send(libro); // Si se encuentra el libro, enviarlo como respuesta
            } else {
                res.status(404).send('Libro no encontrado'); // Si no se encuentra el libro, enviar un mensaje de error
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error al obtener libro');
        });
});

// POST
app.post('/libros/post', (req, res) => {
    const nuevoLibro = new Libro({
        titulo: req.body.titulo,
        autor: req.body.autor,
        ejemplares: req.body.ejemplares
    });

    nuevoLibro.save().then(libroGuardado => {
        console.log('Libro guardado correctamente:', libroGuardado);
        res.status(200).send('Libro guardado correctamente');
    }).catch(error => {
        console.error('Error al guardar el libro:', error);
        res.status(500).send('Error al guardar el libro');
    });
});

// PUT
app.put('/libros/update/:id', (req, res) => {
    const libroId = req.params.id;
    const { titulo, autor, ejemplares } = req.body;

    Libro.findByIdAndUpdate(libroId, { titulo, autor, ejemplares }, { new: true })
        .then(libroActualizado => {
            if (!libroActualizado) {
                return res.status(404).send('Libro no encontrado');
            }
            console.log('Libro actualizado correctamente:', libroActualizado);
            res.status(200).send('Libro actualizado correctamente');
        })
        .catch(error => {
            console.error('Error al actualizar el libro:', error);
            res.status(500).send('Error al actualizar el libro');
        });
});
    
// DELETE
app.delete('/libros/delete/:id', (req, res) => {
    const libroId = req.params.id;

    // Eliminar el libro de la base de datos
    Libro.findByIdAndDelete(libroId)
        .then(libroEliminado => {
            if (!libroEliminado) {
                return res.status(404).send('Libro no encontrado');
            }
            console.log('Libro eliminado correctamente:', libroEliminado);
            res.status(200).send('Libro eliminado correctamente');
        })
        .catch(error => {
            console.error('Error al eliminar el libro:', error);
            res.status(500).send('Error al eliminar el libro');
        });
});

// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor Express iniciado en el puerto 8080');
});
