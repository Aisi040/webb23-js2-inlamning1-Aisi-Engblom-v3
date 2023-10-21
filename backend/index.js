const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const highscoresFilePath = path.join(__dirname, 'data', 'highscores.json'); // Använd __dirname för att bygga sökvägen korrekt

app.use(express.json());

// CSP-header
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:1234"); // Lägg till andra domäner och källor efter behov
    next();
});

// CORS-konfiguration
const corsOptions = {
    origin: 'http://localhost:1234', // Anpassa detta till den port där din frontend körs
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// GET-rutt för highscores
app.get('/highscores', (req, res) => {
    fs.readFile(highscoresFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Kunde inte läsa highscores');
        }
        res.send(data);
    });
});

// POST-rutt för highscores
app.post('/highscores', (req, res) => {
    console.log("Received data:", req.body);
    const newScore = req.body;

    fs.readFile(highscoresFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Kunde inte läsa highscores');
        }
        let scores = JSON.parse(data);

        scores.push(newScore);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5);

        fs.writeFile(highscoresFilePath, JSON.stringify(scores, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Kunde inte uppdatera highscores');
            }
            res.send({ message: 'Highscore uppdaterad' });
        });
    });
});

// Starta servern
app.listen(3000, () => {
    console.log('Listening on port 3000 ...');
});
