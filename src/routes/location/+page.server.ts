import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import pg from 'pg';
const { Pool } = pg;

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const actions = {
    
    default: async ({ cookies, request }) => {
        let reqData = await request.formData()
        // Returns as format:
        // FormData {
        //     "name" => "string",

        // Write to table Locations
        try{
            await pool.query(
                'INSERT INTO Locations (name) VALUES ($1)',
                [reqData.get("name")]
            )
        }
        catch(err){
            console.error(err);

            await pool.query(
                'INSERT INTO Errors (timestamp, error) VALUES ($1, $2)',
                [Date.now(), err]
            )

            return {
                code: 500,
                message: "Database error, Could not add product."
            }
        }

        pool.on('error', (err, client) => {
            console.error('Unexpected error on idle client', err)

            return {
                code: 500,
                message: err
            }
        });

        throw redirect(303, "/locations");
    }
} satisfies Actions;