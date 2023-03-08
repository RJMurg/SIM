import express from 'express';
import bodyParser from 'body-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import * as Eta from 'eta';
import { v4 as uuidv4 } from 'uuid';

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

const users = join(__dirname, "/users.json");
const userAdapter = new JSONFile(users)
const userDb = new Low(userAdapter)

await db.read()
await userDb.read()

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

let adminCookie = uuidv4();

userDb.data ||= {
    users:[],
    active: false
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

                if(removalDate[0] < dateCheck[0]){
                    outOfDate = true;
                }
                else if(removalDate[1] < dateCheck[1]){
                    outOfDate = true;
                }
                else if(removalDate[2] <= dateCheck[2]){
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
                + '<form action="/remove"><input type="hidden" name="id" value="' + Object.values(toSend)[i][j].product.id + '"><button class="removebutton"><i class="fa fa-trash"></i>Remove</button></form></td></tr>'
                finalMessage = finalMessage + "<br><br>";
            }
        }
    }

    finalMessage = finalMessage + "</table>";

    let parsedSend = JSON.stringify(toSend);

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

    let id = req.query.id;

    for(let i = 0; i < Object.keys(db.data).length; i++){
        for(let j = 0; j < Object.values(db.data)[i].length; j++){
            if(Object.values(db.data)[i][j].product.id == id){
                Object.values(db.data)[i].splice(j, 1);
            }
        }
    }

    await db.write()

    res.redirect('/');
})

app.get('/login', async function(req, res) {
    res.render('login')
})

app.get('/logging', async function(req, res) {
    let pwd = req.query.pwd;
    let failure = false;

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].password == pwd){
            let send = "/admin?admin=" + adminCookie;
            res.redirect(send);
            break;
        }
        
        if(i == userDb.data.users.length - 1){
            failure = true;
        }
    }

    if(failure == true){
        res.redirect('/admin')
    }
})

app.get('/admin', async function(req, res) {
    
    if(req.query.admin == adminCookie){
        res.render('admin')
    }
    else{
        res.render('failure')
    }
})

app.get('/users', async function(req, res) {
    res.render('users')
})

console.log('Listening on port ' + port + '...');
app.listen(port)