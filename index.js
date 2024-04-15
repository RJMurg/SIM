// Library imports
import express from 'express'; // Webserver
import bodyParser from 'body-parser'; // Currently unused
import { join, dirname } from 'node:path'; //
import { fileURLToPath } from 'node:url';  //  LowDB uses all of
import { Low } from 'lowdb';               //  these imports.
import { JSONFile } from 'lowdb/node';     //
import { v4 as uuidv4 } from 'uuid'; // Each product is given a UUID to easy internal handling.
import * as Eta from "eta" // Template engine

const app = express()
const port = 3000 // Modify this port to whatever you want SIM to run on.


// Express & ETA boilerplate.
const __dirname = dirname(fileURLToPath(import.meta.url));
app.engine('eta', Eta.renderFile);
Eta.configure({ views: join(__dirname, '/views'), cache: true })
app.set("views", join(__dirname, '/views'))
app.set("view cache", true)
app.set("view engine", "eta")

// Opening all the Databases.
const stock = join(__dirname, "/db.json");
const adapter = new JSONFile(stock)
const db = new Low(adapter)

const removed = join(__dirname, "/removed.json");
const removedAdapter = new JSONFile(removed)
const removedDb = new Low(removedAdapter)

// Reading in DBs.
await db.read()
await removedDb.read()

// Layout for Products DB
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

// Layout for Removed DV
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

// Landing page web request.
app.get('/', async function (req, res) {
    let toSend = db.data; // Getting the entire products list.

    /*
    As ETA is a template engine, it can send the .ETA file (Essentially HTML) text or HTML code to run.
    The out-of-date list is a dynamically constructed string with HTML elements. This is called 'finalMessage'
    and will be sent to the ETA on render which becomes stock HTML for the user to view.
    */
    let finalMessage = "<table>";

    // The date form element encodes as YYYY-MM-DD, so we must make today's date parse the same.
    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().slice(0,10);
    let dateCheck = todaysDate.split('-')


    // These two loops go through every element in the DB.
    // The first for loop goes through each main area.
    // The section goes through each item in that area.
    for(let i = 0; i < Object.keys(toSend).length; i++){
        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            let outOfDate = false; // Starting assuming items are in date.

            // Grabbing expiration date. and parsing it
            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            // Taking the days before expiration it should be removed by and taking that away, see Issue #4.
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            // Converting strings into numbers.
            for(let k = 0; k < removalDate.length; k++){
                removalDate[k] = parseInt(removalDate[k])
                dateCheck[k] = parseInt(dateCheck[k])

                // This questionably written statement checks to see if it is out of date.
                // Though ugly, it functions perfectly.
                if(
                    removalDate[0] < dateCheck[0] ||
                    removalDate[1] < dateCheck[1] ||
                    removalDate[2] <= dateCheck[2]
                ){
                    outOfDate = true;
                }

            }

            if(outOfDate == true){
                // Split the JSON nested object title from camel case to normal text.
                let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

                // Constructing the bulk of the HTML to be sent to the renderer.
                finalMessage = finalMessage
                + "<tr><td>"
                + Object.values(toSend)[i][j].product.quantity
                + "x " + Object.values(toSend)[i][j].product.name
                + " found in " + area + " to be removed "
                + [...removalDate].reverse().join('/') + "."
                + "</td><td>"
                + '<form action="/remove"><input type="hidden" name="id" value="'
                + Object.values(toSend)[i][j].product.id // Writing the remove button forms.
                + '"><button class="removebutton"><i class="fa fa-trash"></i>Remove</button></form></td></tr>'
                finalMessage = finalMessage + "<br><br>";
            }
        }
    }

    finalMessage = finalMessage + "</table>"; // Closing it off.

    res.render('index', { data: finalMessage})
})

app.get('/add', function (req, res) {
    res.render('add')
})

// This is sent from a form in '/add'.
// This must be async as DB writes need to be awaited.
app.get('/adding', async function(req, res) {
    // Data ripped from the request query.
    let item = req.query.name;
    let quantity = req.query.quantity;
    let date = req.query.date;
    let remby = req.query.remby;
    let area = req.query.area;

    // Written correctly to the products DB, UUID generated here.
    db.data[area].push({product:{name:item, quantity: quantity, expiry: date, remby: remby, id: uuidv4()}});

    // Though it is pushed to db.data, it will not be written to the JSON file unless told to.
    await db.write()

    // Returning to homepage.
    res.redirect('/');

})

// Each remove button for products on the homepage are forms with invisible data stating its UUID.
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

                // Before the product is removed from the main DB, it is written to 'RemovedDB', a list of all removed products, which states the date they were removed.
                removedDb.data[area].push({product:{name: item, quantity: quantity, expiry: expiry, remby: remby, id: id, removed: removedDate}});

                // Removing from main DB.
                Object.values(db.data)[i].splice(j, 1);
            }
        }
    }

    // Writing to JSON.
    await db.write()
    await removedDb.write()

    // Returning to Homepage.
    res.redirect('/');
})

// This shows all products currently on the floor.
app.get('/view', async function(req, res) {
    let toSend = db.data

    // Like the homepage, a table is used to display the data.
    // It is clearly a table in this page and rows already exist.
    let finalMessage = ""

    // 2 For loops, one for each area, one for each product in area 'i'.
    for(let i = 0; i < Object.keys(toSend).length; i++){
        // Turning CamelCase into spaced, capitalised text.
        let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            // Calculating when the product should be removed.
            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            let expiryDate = Object.values(toSend)[i][j].product.expiry
            expiryDate = expiryDate.split('-')

            // Dynamic table row construction.
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

// This is pretty much identical to '/view' but modified for the removal DB.
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

// States what port the app is running on, and actually runs it on that port.
console.log('Listening on port ' + port + '...');
app.listen(port)