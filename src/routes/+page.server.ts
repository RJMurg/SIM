import type { PageServerLoad } from './$types';
import pg from 'pg';
const { Pool } = pg;

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const load = (async () => {
    
    // See if the tables exist, if not, create them
    const checkProducts = await pool.query('SELECT * FROM Products');

    if (checkProducts.rows.length == 0) {
        await pool.query('CREATE TABLE Products (id SERIAL PRIMARY KEY, name TEXT, quantity INT, expiry TEXT, removal TEXT, location INT)');
    }

    const checkLocations = await pool.query('SELECT * FROM Locations');

    if (checkLocations.rows.length == 0) {
        await pool.query('CREATE TABLE Locations (id SERIAL PRIMARY KEY, name TEXT)');
    }

    const checkRemoved = await pool.query('SELECT * FROM Removed');

    if (checkRemoved.rows.length == 0) {
        await pool.query('CREATE TABLE Removed (id SERIAL PRIMARY KEY, name TEXT, quantity INT, expiry TEXT, removal TEXT, location INT, removed TEXT)');
    }

    const checkErrors = await pool.query('SELECT * FROM Errors');

    if (checkError.rows.length == 0) {
        await pool.query('CREATE TABLE Error (id SERIAL PRIMARY KEY, timestamp TEXT, error TEXT)');
    }

    const res = await pool.query('SELECT * FROM Products');

    const locs = await pool.query('SELECT * FROM Locations');

    // Replace integer number in location in Products with string name of location from Locations
    for (let i = 0; i < res.rows.length; i++) {
        for (let j = 0; j < locs.rows.length; j++) {
            if (res.rows[i].location == locs.rows[j].id) {
                res.rows[i].location = locs.rows[j].name;
            }
        }
    }

    // Check today's date against removal date
    // If removal date is today or earlier, keep in res,
    // else remove from res

    const rawToday = new Date();
    const today = rawToday.getTime();
    let productDate;

    for (let i = 0; i < res.rows.length; i++) {
        productDate = new Date(res.rows[i].removal).getTime();
        if (productDate >= today) {
            res.rows.splice(i, 1);
            i--;
        }
    }

    // Change expiry and removal from YYYY-MM-DD to DD/MM/YYYY
    for (let i = 0; i < res.rows.length; i++) {
        res.rows[i].expiry = res.rows[i].expiry.substring(8, 10) + "/" + res.rows[i].expiry.substring(5, 7) + "/" + res.rows[i].expiry.substring(0, 4);
        res.rows[i].removal = res.rows[i].removal.substring(8, 10) + "/" + res.rows[i].removal.substring(5, 7) + "/" + res.rows[i].removal.substring(0, 4);
    }

    return {
        products: res.rows
    };
}) satisfies PageServerLoad;