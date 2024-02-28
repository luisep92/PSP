const express = require('express');
const mongoose = require("mongoose");
const url = require("url");
const fs = require("fs");

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/examen');

// Definir el esquema del pokemon
let pokeSchema = new mongoose.Schema({
    name: String,
    level: Number,
    health: Number
});

// Create player model
let Pokemon = mongoose.model('pokemon', pokeSchema);

// Create express app
let app = express();
app.use(express.json());

// A
app.get('/pokemon', (req, res) => {
    Pokemon.find().then(result => {
        res.send(result);
    }).catch(error => {
        console.error(error);
        res.status(500).send('Error getting pokemons');
    });
});

// B
app.post('/pokemon/post', (req, res) => {
    const newPokemon = new Pokemon({
        name: req.body.name,
        level: req.body.level,
        health: req.body.health
    });

    newPokemon.save().then(savedPokemon => {
        console.log('Pokemon saved correctly:', savedPokemon);
        res.status(200).send('Pokemon saved correctly');
    }).catch(error => {
        console.error('Error saving pokemon:', error);
        res.status(500).send('Error saving pokemon');
    });
});

// D
app.put('/pokemon/update/:name', (req, res) => {
    const pokeName = req.params.name;
    const { name, level, health } = req.body;

    Pokemon.findOneAndUpdate({name: pokeName}, { name, level, health }, { new: true, upsert: true })
            .then(updatedPoke => {
                if (!updatedPoke) {
                    return res.status(404).send('Pokemon not found');
                }
                console.log('Pokemon updated correctly:', updatedPoke);
                res.status(200).send('Pokemon updated correctly');
            })
            .catch(error => {
                console.error('Error updating pokemon:', error);
                res.status(500).send('Error updating pokemon');
            });
});

//C
app.get('/pokemon/filter', (req, res) => {
    var url_parts = url.parse(req.url, true);
    const minLevel = url_parts.query.level;
    const maxHealth = url_parts.query.health;
    if(minLevel && maxHealth){
        Pokemon.find({ level: { $gt: minLevel }, health: { $lt: maxHealth } })
                .then(result => {
                    res.send(result);
                }).catch(error => {
                    console.error(error);
                    res.status(500).send('Error getting players');
                });
    }
    else{
        res.status(400).send('Need parameters level and health');
    }
});
    
// E
app.get('/json/:name', (req, res) => {
    const name = req.params.name;
    const file = "./" + name

    fs.readFile(file, (err, data) =>{
        if (err) {
            console.log(err)
            res.writeHead(500)
            res.end("Internal server error")
            return
        }
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
        res.write(data);
        res.end();
    });
});


// Iniciar el servidor en el puerto 8080
app.listen(8080, () => {
    console.log('Servidor Express iniciado en el puerto 8080');
});
