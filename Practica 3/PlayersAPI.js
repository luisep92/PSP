const express = require('express');
const mongoose = require("mongoose");
const url = require("url");

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/practica3');

// Definir el esquema del libro
let playerSchema = new mongoose.Schema({
    name: String,
    score: Number,
    class: String
});

// Create player model
let Player = mongoose.model('players', playerSchema);

// Create express app
let app = express();
app.use(express.json());

// Get all players
app.get('/players', (req, res) => {
    Player.find().then(result => {
        res.send(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error getting players');
    });
});

// Get players filter: name contains searchString. Score must be greater than minScore
app.get('/players/filter/:name/:score', (req, res) => {
    const searchString = req.params.name; 
    const minScore = parseInt(req.params.score);
    Player.find({ name: { $regex: searchString, $options: 'i' },
                 score: { $gt: minScore } })
        .then(result => {
            res.send(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error getting players');
    });
});

// Get player by ID
app.get('/players/:id', (req, res) => {
    const playerId = req.params.id; 
    Player.findById(playerId)
        .then(player => {
            if (player) {
                res.send(player); 
            } else {
                res.status(404).send('Libro no encontrado');
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error getting player');
        });
});

// POST
app.post('/players/post', (req, res) => {
    const newPlayer = new Player({
        name: req.body.name,
        score: req.body.score,
        class: req.body.class
    });

    newPlayer.save().then(savedPlayer => {
        console.log('Player saved correctly:', savedPlayer);
        res.status(200).send('Player saved correctly');
    }).catch(error => {
        console.error('Error saving player:', error);
        res.status(500).send('Error saving player');
    });
});

// PUT
app.put('/players/update/:id', (req, res) => {
    const playerId = req.params.id;
    const { name, score, clas } = req.body;

    Player.findByIdAndUpdate(playerId, { name, score, clas }, { new: true })
        .then(updatedPlayer => {
            if (!updatedPlayer) {
                return res.status(404).send('Player not found');
            }
            console.log('Player updated correctly:', updatedPlayer);
            res.status(200).send('Player updated correctly');
        })
        .catch(error => {
            console.error('Error updating player:', error);
            res.status(500).send('Error updating player');
        });
});

// PUT increase X to score of players that have less than Y
app.put('/players/update/:scoreToIncrease/:maxScore', (req, res) => {
    const scoreToIncrease = parseInt(req.params.scoreToIncrease);
    const maxScore = parseInt(req.params.maxScore);
    Player.updateMany({ score: { $lt: maxScore } }, { $inc: { score: scoreToIncrease } })
        .then(result => {
            console.log('Scores updated successfully:', result);
            res.status(200).send('Scores updated successfully');
        })
        .catch(error => {
            console.error('Error updating scores:', error);
            res.status(500).send('Error updating scores');
        });
});
    
// DELETE
app.delete('/players/delete/:id', (req, res) => {
    const playerId = req.params.id;

    Player.findByIdAndDelete(playerId)
        .then(deletedPlayer => {
            if (!deletedPlayer) {
                return res.status(404).send('Player not found');
            }
            console.log('Player deleted correctly:', deletedPlayer);
            res.status(200).send('Player deleted correctly');
        })
        .catch(error => {
            console.error('Error deleting player:', error);
            res.status(500).send('Error deleting player');
        });
});



// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor Express iniciado en el puerto 8080');
});
