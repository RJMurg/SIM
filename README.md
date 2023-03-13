# SIM - MVP
## A Shop Inventory Managment system.

SIM - MVP (Minimum Viable Product) is a stripped-down version of SIM. It contains features present in the original project scope.
SIM is a Node app using LowDB, ETA and Express to create a simple web app that can be used to keep track of product expiry dates.

### Features
- Automatic listing of out-of-date products.
- Removing out-of-date products.
- Adding of products and information.
- Viewing all products.
- Viewing all removed products.

SIM - MVP does NOT contain: Users, Admin Panel, Removal Reasons, Removal by User, Cookies, Password Hashing, XSS Protection, etc.

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
