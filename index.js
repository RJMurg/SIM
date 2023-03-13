import express from 'express';
import bodyParser from 'body-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import * as Eta from "eta"

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));
app.engine('eta', Eta.renderFile);
Eta.configure({ views: join(__dirname, '/views'), cache: true })
app.set("views", join(__dirname, '/views'))
app.set("view cache", true)
app.set("view engine", "eta")

const stock = join(__dirname, "/db.json");
const adapter = new JSONFile(stock)
const db = new Low(adapter)

const removed = join(__dirname, "/removed.json");
const removedAdapter = new JSONFile(removed)
const removedDb = new Low(removedAdapter)

await db.read()
await removedDb.read()

db.data ||= {
    TillSnacks:[],
    LaneSeparator:[],
    IceCreamFreezer:[],
    SmallMinerals:[],
    SpiderFridge:[],
    BakeryItems:[],
    RedValueBaskets:[],
    BigCrisps:[],
    ConsumablesAisle:[],
    BiscuitsAisle:[],
    BreadAisle:[],
    EggsBakingAndCookingAisle:[],
    OutsideAlcoholSnacks:[],
    Alcohols:[],
    DairyWall:[],
    DairyWallFreezer:[],
    BigMinerals:[],
    PetFoodAndPolishProduceAisle:[]
}

removedDb.data ||={
    TillSnacks:[],
    LaneSeparator:[],
    IceCreamFreezer:[],
    SmallMinerals:[],
    SpiderFridge:[],
    BakeryItems:[],
    RedValueBaskets:[],
    BigCrisps:[],
    ConsumablesAisle:[],
    BiscuitsAisle:[],
    BreadAisle:[],
    EggsBakingAndCookingAisle:[],
    OutsideAlcoholSnacks:[],
    Alcohols:[],
    DairyWall:[],
    DairyWallFreezer:[],
    BigMinerals:[],
    PetFoodAndPolishProduceAisle:[]
}

app.use(express.static('public'))
app.get('/', async function (req, res) {
    let toSend = db.data;
    let finalMessage = "<table>";

    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().slice(0,10);
    let dateCheck = todaysDate.split('-')

    for(let i = 0; i < Object.keys(toSend).length; i++){
        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            let outOfDate = false;

            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            for(let k = 0; k < removalDate.length; k++){
                removalDate[k] = parseInt(removalDate[k])
                dateCheck[k] = parseInt(dateCheck[k])

                if(
                    removalDate[0] < dateCheck[0] ||
                    removalDate[1] < dateCheck[1] ||
                    removalDate[2] <= dateCheck[2]
                ){
                    outOfDate = true;
                }

            }

            if(outOfDate == true){
                // Split the JSON nested object title from camel case to normal text
                let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

                finalMessage = finalMessage
                + "<tr><td>"
                + Object.values(toSend)[i][j].product.quantity
                + "x " + Object.values(toSend)[i][j].product.name
                + " found in " + area + " to be removed "
                + [...removalDate].reverse().join('/') + "."
                + "</td><td>"
                + '<form action="/remove"><input type="hidden" name="id" value="'
                + Object.values(toSend)[i][j].product.id
                + '"><button class="removebutton"><i class="fa fa-trash"></i>Remove</button></form></td></tr>'
                finalMessage = finalMessage + "<br><br>";
            }
        }
    }

    finalMessage = finalMessage + "</table>";

    res.render('index', { data: finalMessage})
})

app.get('/add', function (req, res) {
    res.render('add')
})

app.get('/adding', async function(req, res) {
    let item = req.query.name;
    let quantity = req.query.quantity;
    let date = req.query.date;
    let remby = req.query.remby;
    let area = req.query.area;

    db.data[area].push({product:{name:item, quantity: quantity, expiry: date, remby: remby, id: uuidv4()}});

    await db.write()

    res.redirect('/');

})

app.get('/remove', async function (req, res) {
    let removedDate = new Date()
    removedDate = removedDate.toISOString().slice(0, 10);

    let id = req.query.id;

    for(let i = 0; i < Object.keys(db.data).length; i++){
        for(let j = 0; j < Object.values(db.data)[i].length; j++){
            if(Object.values(db.data)[i][j].product.id == id){
                let item = Object.values(db.data)[i][j].product.name
                let quantity = Object.values(db.data)[i][j].product.quantity
                let expiry = Object.values(db.data)[i][j].product.expiry
                let remby = Object.values(db.data)[i][j].product.remby
                let area = Object.keys(db.data)[i]

                removedDb.data[area].push({product:{name: item, quantity: quantity, expiry: expiry, remby: remby, id: id, removed: removedDate}});

                Object.values(db.data)[i].splice(j, 1);
            }
        }
    }

    await db.write()
    await removedDb.write()

    res.redirect('/');
})

app.get('/view', async function(req, res) {
    let toSend = db.data
    let finalMessage = ""

    for(let i = 0; i < Object.keys(toSend).length; i++){
        let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            let expiryDate = Object.values(toSend)[i][j].product.expiry
            expiryDate = expiryDate.split('-')

            finalMessage = finalMessage
            + "<tr><td>"
            + Object.values(toSend)[i][j].product.name
            + "</td><td>"
            + Object.values(toSend)[i][j].product.quantity
            + "</td><td>"
            + [...expiryDate].reverse().join('/')
            + "</td><td>"
            + [...removalDate].reverse().join('/')
            + "</td><td>"
            + area
            + "</td></tr>"
        }
    }

    res.render('view.eta', {data: finalMessage})
})

app.get('/removedList', async function(req, res) {
    let toSend = removedDb.data
    let finalMessage = ""

    for(let i = 0; i < Object.keys(toSend).length; i++){
        let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            let expiryDate = Object.values(toSend)[i][j].product.expiry
            expiryDate = expiryDate.split('-')

            let removedDate = Object.values(toSend)[i][j].product.removed
            removedDate = removedDate.split('-');

            finalMessage = finalMessage
            + "<tr><td>"
            + Object.values(toSend)[i][j].product.name
            + "</td><td>"
            + Object.values(toSend)[i][j].product.quantity
            + "</td><td>"
            + [...expiryDate].reverse().join('/')
            + "</td><td>"
            + [...removalDate].reverse().join('/')
            + "</td><td>"
            + area
            + "</td><td>"
            + [...removedDate].reverse().join('/')
            + "</td></tr>"
        }
    }

    res.render('removedlist.eta', {data: finalMessage})
})

console.log('Listening on port ' + port + '...');
app.listen(port)