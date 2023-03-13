# SIM V1.0.2
## A Shop Inventory Managment system.

SIM is a web app designed to help small businesses keep track of the expiration of products in the stockroom or on the floor.

It is written in Node using LowDB for the database, ETA for serving content and Express for the web server.

### Features
- Automatic listing of out-of-date products.
- Removing out-of-date products.
- Adding of products and information.
- Viewing all products.
- Viewing all removed products.

### Requirements
- Node.js

### Setup
1. Clone or download the repo.
2. Open a command prompt in the directory, and run `npm install`
3. Change the Port on line 11 of *index.js* if you wish, default is '3000'
3. Run `npm start`
4. Navigate to `localhost:[PORT]`

## Usage
When you want to add a product to the expiration database, press the 'Add New' button on the homepage and fill out the relevant details.
When you have removed the item from the shelves, press the relevant removal button.
To view all products, press the 'View All Products' button on the homepage.
To view all removed products, press the 'View Removed Products' button on the homepage.