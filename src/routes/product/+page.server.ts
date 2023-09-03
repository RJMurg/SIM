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
        // Returns as format:
        // FormData {
        //     "name" => "string",
        //     "quantity" => "string",
        //     "expiry" => "string",
        //     "removal" => "string",
        //     "location" => "int",

        // Write to table Products
        try{
            await pool.query(
                'INSERT INTO Products (name, quantity, expiry, removal, location) VALUES ($1, $2, $3, $4, $5)',
                [reqData.get('name'), reqData.get('quantity'), reqData.get('expiry'), reqData.get('removal'), reqData.get('location')]
            );
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

        return {
            code: 200,
            message: reqData.get('name')
        }
    }
} satisfies Actions;