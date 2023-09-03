import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { Pool } from 'pg';

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const load: PageServerLoad = async ({ params }) => {
    let slug = params.slug;

    let product = Object.create(null);

    const locations = await pool.query('SELECT * FROM Locations');

    try{
        product = await pool.query('SELECT * FROM Products WHERE ID = $1', [slug]);
    }
    catch(err){
        return {
            code: 500,
            message: "Database error, Could not find product.",
            product: {
                expiry: "1970-01-01",
                removal: "1970-01-01"
            },
            locations: locations.rows
        }
    }
   
    if (Object.keys(product.rows).length > 0){
        return{
            code: 200,
            product: product.rows[0],
            locations: locations.rows
        }
    }
    else{
        return {
            code: 500,
            message: "Database error, Could not find product.",
            product: {
                expiry: "1970-01-01",
                removal: "1970-01-01"
            },
            locations: locations.rows
        }
    }
};

export const actions = {
    default: async ({ cookies, request }) => {
        let reqData = await request.formData()

        // Returns as format:
        // FormData {
        //     "id" => "int",
        //     "name" => "string",
        //     "quantity" => "string",
        //     "location" => "int",
        //     "expiry" => "string",
        //     "remove" => "string"

        // Write to table Products
        try{
            await pool.query(
                'UPDATE Products SET name = $1, quantity = $2, location = $3, expiry = $4, removal = $5 WHERE ID = $6',
                [reqData.get('name'), reqData.get('quantity'), reqData.get('location'), reqData.get('expiry'), reqData.get('remove'), reqData.get('id')]
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
                message: "Database error, Could not edit product."
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