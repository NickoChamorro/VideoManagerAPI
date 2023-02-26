/* const express = require('express');
const multer = require('multer');
const mysql = require('mysql'); */

import express from "express";
import cors from "cors";
import {Sequelize, DataTypes} from "sequelize";

/* import multer from "multer"; */


// DATABASE

const PORTAPI = process.env.PORT || 8000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Mysql';
const DB_NAME = process.env.DB_NAME || 'videomanager';
const DB_PORT = process.env.DB_PORT || 3306;
const DIALECT = "mysql"; 

const db = new Sequelize (DB_NAME, DB_USER, DB_PASS,{  
  host: DB_HOST, 
  dialect: DIALECT, 
  port: DB_PORT 
});

/* const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT
}); */

// MAIN CONFIG
const app = express();
app.use(cors());
app.use (express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// MODELS
const VideosModel = db.define("videos",{
    idVideo: {type:DataTypes.INTEGER,primaryKey:true},
    thumb:{type:DataTypes.BLOB}
}, { timestamps: false },
);

// CONTROLLERS}
const getMessage = async (req,res)=>{
    res.json({success: true, message: 'welcome to backend zone!'});
};

const getVideo = async (req, res)=>{
    try{
        const video = await VideosModel.findOne({
            where:{idVideo:req.params.id}
        })  
        res.json(video)
    } catch (error) {
        res.json({message: error.message})
    }
};

const insertVideo = async (req,res)=>{
  try {
      await VideosModel.create (req.body)
      res.json ({message: "Video successfully uploaded."})
  } catch (error) {
      res.json ({message:error.message})
  }
};

// ROUTES
const router = express.Router();

router.get ("/", getMessage);
router.get ("/:id", getVideo);
router.post ("/", insertVideo);

// MAIN FUNCTIONS

app.use("/videos",router); 

try {
    await db.authenticate()
    console.log("DB connection OK")
} catch (error) {
    console.log(`DB connection failed due to error ${error}`)
};

const port = PORTAPI //8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
})

/* app.get('/', (req, res) => {
  res.json({success: true, message: 'welcome to backend zone!'});
}); 
*/

/*
app.post('/upload', multer().single('video'), (req, res) => {
    const video = req.file; //req.file.buffer

    if (!video) {
      const error = new Error('Error uploading the file')
      res.json({success: false, message: error})
      return;
    } 

    res.json({success: true, message: 'The file arrived to backend.'})
    
    const sql = 'INSERT INTO videos (thumb) SET ?';
    connection.query(sql, { video }, (err, result) => {
        if (err) {
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
    });  
});
*/

