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

    const res = await pool.query('SELECT * FROM Removed');

    const locs = await pool.query('SELECT * FROM Locations');

    // Replace integer number in location in Products with string name of location from Locations
    for (let i = 0; i < res.rows.length; i++) {
        for (let j = 0; j < locs.rows.length; j++) {
            if (res.rows[i].location == locs.rows[j].id) {
                res.rows[i].location = locs.rows[j].name;
            }
        }
    }

    // Replace YYYY-MM-DD HH:MM:SS.MMMMMM+HH in removed with DD-MM-YY @ HH:MM
    for (let i = 0; i < res.rows.length; i++) {
        let date = res.rows[i].removed.split(' ')[0].split('-');
        let time = res.rows[i].removed.split(' ')[1].split(':');
        res.rows[i].removed = date[2] + '-' + date[1] + '-' + date[0] + ' @ ' + time[0] + ':' + time[1];
    }

    return {
        products: res.rows
    };
}) satisfies PageServerLoad;