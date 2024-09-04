const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from 'Proiectweb/Resurse'
app.use('/resurse', express.static(path.join(__dirname, 'Proiectweb/resurse')));
app.use('/css', express.static(path.join(__dirname, 'Proiectweb/CSS')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Load error configuration JSON
let obGlobal = { obErori: null };

function initErori() {
    const rawdata = fs.readFileSync('erori.json');
    const errorData = JSON.parse(rawdata);
    errorData.info_erori.forEach((err) => {
        err.imagine = path.join(__dirname, errorData.cale_baza, err.imagine);
    });
    obGlobal.obErori = errorData;
}

initErori();

// Route for favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'Proiectweb/resurse/Favicon/favicon.ico'));
});

// Route for the homepage
app.get(['/', '/index', '/home'], (req, res) => {
    res.render('pagini/index');
});

// Dynamic routing for any page
app.get('/*', (req, res) => {
    const requestedPage = req.params[0];
    res.render(`pagini/${requestedPage}`, {}, (err, html) => {
        if (err) {
            if (err.message.startsWith('Failed to lookup view')) {
                // 404 Page Not Found
                const error = obGlobal.obErori.info_erori.find(err => err.identificator === 404);
                res.status(404).render('pagini/eroare', error);
            } else {
                res.status(500).send('Something went wrong!');
            }
        } else {
            res.send(html);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
