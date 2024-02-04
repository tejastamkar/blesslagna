import mysql from "mysql2/promise";


export async function conntecToDB() {
    return await mysql.createConnection({
        host: "blesslagna.com", // Change this to your MySQL server host if different
        // host: "localhost", // Change this to your MySQL server host if different
        user: "blessa3h_app_user", // Change this to your MySQL username
        password: "blesslagna123!@#", // Change this to your MySQL password
        database: "blessa3h_app_db", // Change this to the name of your database
    });
}

// export let connection = await conntecToDB();



export var pool = await conntecToDB();

export const dbConnectionMiddleware = async (req, res, next) => {
    try {


        pool = await conntecToDB();


        // Call the next middleware function
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).send('Database connection failed');
    }
};

// Use the database connection middleware