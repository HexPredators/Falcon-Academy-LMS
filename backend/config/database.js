const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
        console.log('Database connected successfully');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        return false;
    }
};

const query = async (sql, params) => {
    try {
        const [rows] = await promisePool.query(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

const execute = async (sql, params) => {
    try {
        const [result] = await promisePool.execute(sql, params);
        return result;
    } catch (error) {
        console.error('Database execute error:', error);
        throw error;
    }
};

const getConnection = async () => {
    return await promisePool.getConnection();
};

module.exports = {
    pool: promisePool,
    testConnection,
    query,
    execute,
    getConnection
};