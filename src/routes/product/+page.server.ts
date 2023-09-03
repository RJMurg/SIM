import type { PageServerLoad, Actions } from './$types';
import { Pool } from 'pg';

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const load = (async () => {
    await pool.connect();

    const res = await pool.query('SELECT * FROM Locations');

    return {
        locations: res.rows
    };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ cookies, request }) => {
        let reqData = await request.formData()

        return {
            success: true,
        }
    }
} satisfies Actions;