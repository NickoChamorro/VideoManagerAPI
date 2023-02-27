import express from "express";
import cors from "cors";
import {Sequelize, DataTypes} from "sequelize";
import multer from "multer";


// DATABASE

const PORTAPI = process.env.PORT || 8000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Mysql';
const DB_NAME = process.env.DB_NAME || 'videomanager';
const DB_PORT = process.env.DB_PORT || 3306;
const DIALECT = "mysql"; 

const sequalize = new Sequelize (DB_NAME, DB_USER, DB_PASS,{  
  host: DB_HOST, 
  dialect: DIALECT, 
  port: DB_PORT 
});

const VIDEO = sequelize.define('videos', {
    idVideo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    extension: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
  
sequelize.sync();

// MAIN CONFIG
const app = express();
app.use(cors());
/* app.use(express.json()); */

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ROUTES
const upload = multer({ dest: 'store/' });

app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { originalname, size, mimetype, filename } = req.file;

        const videoInfo = await VIDEO.create({
            name: originalname,
            size,
            extension: mimetype,
            path: `store/${filename}`
        });

        res.status(200).send(videoInfo);
    } catch (error) {
        res.status(500).send('Error uploading the video');
    }
});

// OPEN PORT
const port = PORTAPI //8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
});

