const express = require('express');
const multer = require('multer');
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mysql',
  database: 'videomanager'
});

const app = express();

app.get('/', (req, res) => {
    res.json({success: true, message: 'welcome to backend zone!'});
});

app.post('/upload', multer().single('video'), (req, res) => {
    console.log('Entro a hacer un post');
    const video = req.file.buffer;

    const sql = 'INSERT INTO videos (thumb) SET ?';
    connection.query(sql, { video }, (err, result) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    }); 
});

app.listen(8000, () => {
  console.log('Server started on port 8000');
});