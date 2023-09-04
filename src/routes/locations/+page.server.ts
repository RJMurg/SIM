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


    const locs = await pool.query('SELECT * FROM Locations');
    
    return {
        locations: locs.rows
    };
}) satisfies PageServerLoad;