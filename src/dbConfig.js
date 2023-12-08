import mysql from "mysql2/promise";

// Create a connection to the MySQL database
export const pool = await mysql.createConnection({
    host: "blesslagna.com", // Change this to your MySQL server host if different
    user: "blessa3h_app_user", // Change this to your MySQL username
    password: "blesslagna123!@#", // Change this to your MySQL password
    database: "blessa3h_app_db", // Change this to the name of your database
});

