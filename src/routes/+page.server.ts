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

    const today = new Date().setHours(0, 0, 0, 0);

    for (let i = res.rows.length - 1; i >= 0; i--) {
        const productDate = new Date(res.rows[i].removal).setHours(0, 0, 0, 0);
        if (productDate > today) {
            res.rows.splice(i, 1);
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