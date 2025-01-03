# SIM v3.0.0

SIM (Short for Shop Inventory Manager) is a web app that provides at-a-glance information to floor staff on products that need to be removed from the shop floor and wasted.
It is written in SvelteKit.

## Features
- Simple Product Managemnet (Add, Edit & Delete)
- List of Products to be removd that day
- Custom location definition
- Historical list of products
- Barcode scanning to add products

## Development
Prerequisites:
- Node.JS
- PostgreSQL

1. Clone the repo
```bash
git clone https://github.com/RJMurg/SIM.git
```

2. Install Dependencies
```bash
npm install
```

3. Copy .env.example to .env and replace placeholders
```bash
cp .env.example .env
```

4. Migrate the Database
```bash
npx prisma migrate dev
```

5. Run the Database
```bash
npm run dev
```

## Deployment
TBF