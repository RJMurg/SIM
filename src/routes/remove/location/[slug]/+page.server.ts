import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import pg from 'pg';
const { Pool } = pg;

// Read in info from .env file
import { config } from 'dotenv';
config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const load = (async ({ params }) => {
    let slug = params.slug;

    // Slug is ID, copy from Products to Removed table
    // Add 'removed' date to Removed table
    // Delete from Products table
    // Return to /all

    try{
        const result = await pool.query('DELETE FROM Locations WHERE ID = $1', [slug]);


        if(result.rowCount == 0){
            
            return {
                code: 500,
                message: "Database error, Could not remove product."
            }
        }
    }
    catch(err){
        console.log(err)

        return {
            code: 500,
            message: "Database error, Could not remove product."
        }
    }

    throw redirect(303, "/locations");
}) satisfies PageServerLoad;