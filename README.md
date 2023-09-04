# SIM v2.0.1

**NOTE:** SIM v2 is in the `TESTING` phase, while believed to be stable, it cannot be guaranteed to be stable enough. Please use [SIM v1.0.2](https://github.com/RJMurg/SIM/tree/MVP) for production use.

SIM is a Shop Inventory Manager, a simple web tool to manage a shop's inventory. It is written in Svelte and uses a Postgres database.
With SIM, you simply add the product to the inventory and when it is time to waste the product, it will be displayed.

## Features
- Simple Product management (add, edit, delete)
- At-a-glance list of products to be wasted
- Simple and clean UI
- Lists of all products and all wasted products

## Installation
1. Clone the repository
```bash
    git clone https://github.com/RJMurg/SIM.git
```

2. Install dependencies
```bash
    npm install
```

3. Create a .env file in the root directory and add the following:
```bash
    DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
    PORT=4173
```

4. Run the app
```bash
    npm run dev
```