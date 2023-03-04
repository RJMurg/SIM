// SQLite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Express
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.get('/', function (req, res) {
    res.send('Hello World')
  })

console.log('Listening on port ' + port + '...');
app.listen(port)