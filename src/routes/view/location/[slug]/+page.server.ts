import type { PageServerLoad, Actions } from './$types';
import pg from 'pg';
const { Pool } = pg;

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const load: PageServerLoad = async ({ params }) => {
    let slug = params.slug;

    let location = Object.create(null);

    try{
        location = await pool.query('SELECT * FROM Locations WHERE ID = $1', [slug]);
    }
    catch(err){
        return {
            code: 500,
            message: "Database error, Could not find location.",
            location: {
                name: null
            }
        }
    }
   
    if (Object.keys(location.rows).length > 0){
        return{
            code: 200,
            location: location.rows[0]
        }
    }
    else{
        return {
            code: 500,
            message: "Database error, Could not find product.",
            location: {
                name: null
            }
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

        // Write to table Locations
        try{
            await pool.query(
                'UPDATE Locations SET name = $1 WHERE ID = $2',
                [reqData.get("name"), reqData.get("id")]
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