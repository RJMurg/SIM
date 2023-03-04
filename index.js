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

// If db.json doesn't exist, db.data will be null
// Use the code below to set default data
db.data ||= { posts: [] }             // For Node >= 15.x

// Create and query items using native JS API
db.data.posts.push('hello world')
const firstPost = db.data.posts[0]

// Alternatively, you can also use this syntax if you prefer
const { posts } = db.data
posts.push('hello world')

app.use(express.static('public'))
app.get('/', function (req, res) {
    // This should send the index.html file found in public
    res.sendFile(join(__dirname, '/public/index.html'));
})

app.get('/add', function (req, res) {
    // This should send the index.html file found in public
    res.sendFile(join(__dirname, '/public/add.html'));
})

console.log('Listening on port ' + port + '...');
app.listen(port)

// Finally write db.data content to file
await db.write()