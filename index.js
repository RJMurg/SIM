import express from 'express';
import bodyParser from 'body-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';
import * as Eta from "eta"
import cookieParser from 'cookie-parser';

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

userDb.data ||= {
    users:[]
}

if(userDb.data.users.length == 0){
    userDb.data.users.push({name: "admin", position: 0, canEdit: true, isAdmin: true,  password: "admin", id: uuidv4()})
    await userDb.write()

    console.log("No users found, creating admin user with password 'admin'.")
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
            //res.cookie('admin', )
            res.redirect('/admin');
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
    
    //if(req.query.admin == adminCookie){
        res.render('admin/admin')
    //}
    //else{
        //res.render('failure')
    //}
})

app.get('/users', async function(req, res) {
    let userData = "";
    let position = "";

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].position == 0){
            position = "Manager";
        }
        else if(userDb.data.users[i].position == 1){
            position = "Supervisor";
        }
        else if(userDb.data.users[i].position == 2){
            position = "Sales Assistant";
        }


        userData = userData + "<tr><td>"
        + userDb.data.users[i].name
        + "</td><td>"
        + position
        + "</td><td>"
        + userDb.data.users[i].canEdit
        + "</td><td>"
        + userDb.data.users[i].isAdmin
        + "</td><td>"
        + '<form action="/editUser"><input type="hidden" name="id" value="' + userDb.data.users[i].id + '"><button class="add"><i class="fa fa-user"></i>View and Edit User</button></form></td></tr>'
    }

    res.render('admin/users', {data: userData})
})

app.get('/editUser', async function(req, res) {
    let id = req.query.id;
    let name = "";
    let position = 0;
    let manager = "";
    let supervisor = "";
    let salesAssistant = "";
    let canEdit = false;
    let editTrue = "";
    let editFalse = "";
    let isAdmin = false;
    let adminTrue = "";
    let adminFalse = "";

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].id == id){
            name = userDb.data.users[i].name;
            position = userDb.data.users[i].position;
            canEdit = userDb.data.users[i].canEdit;
            isAdmin = userDb.data.users[i].isAdmin;

            if(position == 0){
                manager = 'selected="selected"';
            }
            else if(position == 1){
                supervisor = 'selected="selected"';
            }
            else if(position == 2){
                salesAssistant = 'selected="selected"';
            }

            if(canEdit == true){
                editTrue = 'selected="selected"';
            }
            else{
                editFalse = 'selected="selected"';
            }

            if(isAdmin == true){
                adminTrue = 'selected="selected"';
            }
            else{
                adminFalse = 'selected="selected"';
            }

            break;
        }
    }

    res.render('admin/editUser', {id: id, userName: name, manager: manager, supervisor: supervisor, salesAssistant: salesAssistant, editTrue: editTrue, editFalse: editFalse, adminTrue: adminTrue, adminFalse: adminFalse})
})

app.get('/editing', async function(req, res) {
    let id = req.query.id;
    let name = req.query.name;
    let position = req.query.position;
    let canEdit = req.query.canEdit;
    let isAdmin = req.query.isAdmin;
    let action = req.query.action;

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].id == id){
            userDb.data.users[i].name = name;
            userDb.data.users[i].position = position;
            userDb.data.users[i].canEdit = canEdit;
            userDb.data.users[i].isAdmin = isAdmin;

            if(action == 1){
                res.redirect('/verifyDelete?id' + id)
            }

            await userDb.write();

            res.redirect('/users');
        }
    }
})

app.get('/verifyDelete', async function(req, res) {
    let id = req.query.id;
    let userName = "";

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].id == id){
            userName = userDb.data.users[i].name;
            break;
        }
    }

    console.log(userName)
    res.render('admin/verifyDelete', {userName: userName, id: id})
})

app.get('/deleteUser', async function(req, res) {
    let id = req.query.id;

    for(let i = 0; i < userDb.data.users.length; i++){
        if(userDb.data.users[i].id == id){
            userDb.data.users.splice(i, 1);
            break;
        }
    }

    await userDb.write();

    res.redirect('/users');
})

app.get('/addUser', async function(req, res) {
    res.render('admin/addUser')
})

app.get('/addingUser', async function(req, res) {
    let name = req.query.name;
    let position = req.query.position;
    let canEdit = req.query.canEdit;
    let isAdmin = req.query.isAdmin;
    let id = uuidv4();

    let newUser = {
        name: name,
        position: position,
        canEdit: canEdit,
        isAdmin: isAdmin,
        id: id
    }

    userDb.data.users.push(newUser);

    await userDb.write();

    res.redirect('/users');

})

console.log('Listening on port ' + port + '...');
app.listen(port)