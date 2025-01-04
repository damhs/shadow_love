const { get, put } = require('http');
const pool = require('../mysql.js');

const getPassword = async (id) => {
    try {
        const [result] = await pool.query('SELECT password FROM User WHERE id = ?', [id]);
        return result[0].password;
    }  catch (error) {
        console.error('Error getting password: ', error);
    }
};

const createUser = async (name, id, password) => {
    try {
        await pool.query('INSERT INTO User (name, id, password) VALUES (?, ?)', [name, id, password]);
    } catch (error) {
        console.error('Error creating user: ', error);
    }
};

module.exports = {
    getPassword,
    createUser,
};