const express = require('express');
const multer = require('multer');
const mysql = require('mysql');

const PORTAPI = process.env.PORT || 8000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Mysql';
const DB_NAME = process.env.DB_NAME || 'videomanager';
const DB_PORT = process.env.DB_PORT || 3306;
/* const DIALECT = "mysql"; */

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT
});

const app = express();

app.get('/', (req, res) => {
    res.json({success: true, message: 'welcome to backend zone!'});
});

app.post('/upload', multer().single('video'), (req, res) => {
    const video = req.file; //req.file.buffer

    if (!video) {
      const error = new Error('Error uploading the file')
      res.json({success: false, message: error})
      return;
    } 

    res.json({success: true, message: 'The file arrived to backend.'})

    /* const sql = 'INSERT INTO videos (thumb) SET ?';
    connection.query(sql, { video }, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    });  */
});

app.listen(PORTAPI, () => {
  console.log('Server started on port '+PORTAPI);
});