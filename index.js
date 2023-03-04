import express from 'express';
import bodyParser from 'body-parser';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import * as Eta from 'eta';

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url));
app.engine('eta', Eta.renderFile);
Eta.configure({ views: join(__dirname, '/views'), cache: true })
app.set("views", join(__dirname, '/views'))
app.set("view cache", true)
app.set("view engine", "eta")

const file = join(__dirname, "/db.json");
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

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

app.use(express.static('public'))
app.get('/', async function (req, res) {
    let toSend = db.data;
    let finalMessage = "";

    let todaysDate = new Date();
    todaysDate = todaysDate.toISOString().slice(0,10);
    let dateCheck = todaysDate.split('-')

    for(let i = 0; i < Object.keys(toSend).length; i++){
        for(let j = 0; j < Object.values(toSend)[i].length; j++){
            let barcode = "";
            let outOfDate = false;
            // console.log(Object.values(toSend)[i][j]);

            let removalDate = Object.values(toSend)[i][j].product.expiry
            removalDate = removalDate.split('-');
            removalDate[2] = (parseInt(removalDate[2]) - parseInt(Object.values(toSend)[i][j].product.remby)).toString().padStart(2, '0');

            for(let k = 0; k < removalDate.length; k++){
                removalDate[k] = parseInt(removalDate[k])
                dateCheck[k] = parseInt(dateCheck[k])

                if(removalDate[k] <= dateCheck[k]){
                    if(outOfDate == false){
                        outOfDate = true;
                    }
                }
            }

            if(outOfDate == true){
                // Split the JSON nested object title from camel case to normal text
                let area = Object.keys(toSend)[i].replace(/([A-Z])/g, ' $1').trim();

                if(Object.values(toSend)[i][j].product.barcode.length > 0){
                    barcode = "(" + Object.values(toSend)[i][j].product.barcode + ") ";
                }
                else{
                    barcode = "";
                }

                finalMessage = finalMessage
                + Object.values(toSend)[i][j].product.quantity
                + "x " + Object.values(toSend)[i][j].product.name
                + " found in " + area + " " + barcode + "to be pulled "
                + Object.values(toSend)[i][j].product.remby + " days before " + Object.values(toSend)[i][j].product.expiry + "."
                finalMessage = finalMessage + "<br><br>";
            }
        }
    }

    let parsedSend = JSON.stringify(toSend);

    //console.log(parsedSend)

    res.render('index', { data: finalMessage})
})

app.get('/add', function (req, res) {
    res.render('add')
})

app.get('/adding', async function(req, res) {
    let item = req.query.name;
    let barcode = req.query.barcode;
    let quantity = req.query.quantity;
    let date = req.query.date;
    let remby = req.query.remby;
    let area = req.query.area;

    if(area == "TillSnacks"){
        db.data.TillSnacks.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "LaneSeparator"){
        db.data.LaneSeparator.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "Till2SnackWall"){
        db.data.Till2SnackWall.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "IceCreamFreezer"){
        db.data.IceCreamFreezer.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "SmallMinerals"){
        db.data.SmallMinerals.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "SpiderFridge"){
        db.data.SpiderFridge.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "BakeryItems"){
        db.data.BakeryItems.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if (area == "RedValueBaskets"){
        db.data.RedValueBaskets.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if (area == "BigCrisps"){
        db.data.BigCrisps.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "ConsumablesAisle"){
        db.data.ConsumablesAisle.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "BiscuitsAisle"){
        db.data.BiscuitsAisle.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "BreadAisle"){
        db.data.BreadAisle.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "EggsBakingAndCookingAisle"){
        db.data.EggsBakingAndCookingAisle.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "OutsideAlcoholSnacks"){
        db.data.OutsideAlcoholSnacks.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "Alcohols"){
        db.data.Alcohols.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});	
    }
    else if(area == "DairyWall"){
        db.data.DairyWall.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "DairyWallFreezer"){
        db.data.DairyWallFreezer.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "BigMinerals"){
        db.data.BigMinerals.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }
    else if(area == "PetFoodAndPolishProduceAisle"){
        db.data.PetFoodAndPolishProduceAisle.push({product:{name:item, barcode: barcode, quantity: quantity, expiry: date, remby: remby}});
    }

    await db.write()

    res.redirect('/');

})

console.log('Listening on port ' + port + '...');
app.listen(port)