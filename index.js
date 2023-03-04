import express from 'express';
import bodyParser from 'body-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Express
const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));


// Configure lowdb to write to JSONFile
const file = join(__dirname, "/db.json");
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

app.use(express.static('public'))
app.get('/', function (req, res) {
    // This should send the index.html file found in public
    res.sendFile(join(__dirname, '/public/index.html'));
})

app.get('/add', function (req, res) {
    // This should send the index.html file found in public
    res.sendFile(join(__dirname, '/public/add.html'));
})

app.get('/adding', async function(req, res) {
    let item = req.query.name;
    let barcode = req.query.barcode;
    let quantity = req.query.quantity;
    let date = req.query.date;
    let remby = req.query.remby;
    let area = req.query.area;

    const curDate = new Date();
    let newDate = curDate.getFullYear() + '-' + (curDate.getMonth() + 1).toString().padStart(2, "0") + '-' + curDate.getDate().toString().padStart(2, "0")

    db.data ||= { item: { item: [barcode, quantity, date, remby, added, area]}}
    db.data.item ||= {product: item, barcode: barcode, quantity: quantity, date: date, remby: remby, added: newDate, area: area}

    await db.write()

    // It should then redirect to the index page
    res.redirect('/');

})

console.log('Listening on port ' + port + '...');
app.listen(port)

// Finally write db.data content to file
await db.write()