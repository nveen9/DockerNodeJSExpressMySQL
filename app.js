const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createPool({
    host: 'sqlserver',
    user: process.env.MYSQL_USER,
    //Execute folowing query in MySQL workbench
    //ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new password'
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: 3306,
})

// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to mysql');
//     } else {
//         console.log('DB Connected');
//     }
// })

app.post('/create', (req, res) => {
    const sql = 'CREATE TABLE customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), age INT, country VARCHAR(255))';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error creating table: ' + err.stack);
            res.status(500).json(err);
            return;
        }
        console.log('Table created successfully!', result);
        res.status(200).json({ message: 'Table created successfully' });
    })
})

app.post('/add', (req, res) => {
    const { name, age, country } = req.body;
    const sql = 'INSERT INTO customers (name, age, country) VALUES (?, ?, ?)';
    const values = [name, age, country];
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error creating table: ' + err.stack);
            res.status(500).json(err);
            return;
        }
        console.log('Data inserted successfully!', result);
        res.status(200).json({ message: 'Registered successfully' });
    })
})

app.get('/get', (req, res) => {
    const sql = 'SELECT * FROM customers';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error retreiving data: ' + err.stack);
            res.status(500).json(err);
            return;
        }
        console.log('Data retreiving successfully!', result);
        res.json(result);
    })
})

app.get('/', (req, res) => {
    res.json({message: 'Hellow World!'});
})

const PORT = process.env.PORT || 3000;
app.listen(3000);