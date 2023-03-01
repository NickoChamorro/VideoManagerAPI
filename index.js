import express from "express";
import cors from "cors";
import {Sequelize, DataTypes} from "sequelize";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser.js';


// DATABASE
const PORTAPI = process.env.PORT || 8000;

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'Mysql';
const DB_NAME = process.env.DB_NAME || 'videomanager';
const DB_PORT = process.env.DB_PORT || 3306;
const DIALECT = "mysql"; 

const sequelize = new Sequelize (DB_NAME, DB_USER, DB_PASS,{  
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

// MEDIA STORE

/* const cloudinary = require('cloudinary').v2; */

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MAIN CONFIG
const app = express();
app.use(cors());
/* app.use(express.json()); */

// CONTROLLER
const getMessage = async (req, res)=>{
    console.log(`llega a getMessage`);
    res.json({success: true, message: 'welcome to backend zone!'});
}

const getVideo = async (req, res)=>{

}

const uploadVideo = async (req, res)=>{
    console.log(`llega a uploadVideo`); 
    const fileVideo = req.file;
    if (!fileVideo){
        console.log(`no llega video`);
        return res
        .status(401)
        .json({ success: false, message: "video didn't reach the backend" });
    }
    try {
        console.log(`entra al try`);
        

        /* const datauri = new Datauri();
        datauri.format('.mp4', req.file.buffer); */
        const parser = new DatauriParser();
        parser.format('.mp4', req.file.buffer);

        /* console.log(`parser.content ${parser.content}`); */

        const nameVideo = 'video_'+ new Date();
        // Upload
        const res = await cloudinary.uploader.upload(parser.content, {public_id: nameVideo});  

        res.then((data) => {
            console.log(data);
            console.log(data.secure_url);
        }).catch((err) => {
            console.log(err);
        }); 
          
        /* // Generate 
        const url = cloudinary.url(nameVideo, {
            width: 100,
            height: 150,
            Crop: 'fill'
        });

        console.log(url); */

        /*
        const result = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${user._id}_profile`,
            width: 500,
            height: 500,
            crop: 'fill',
          }); 
        */

        /* const { originalname, size, mimetype, filename } = req.body; */
        /* await VIDEO.create (req.body) */ 
        res.json ({message: "Video successfully uploaded."})
    } catch (error) {
        console.log(`entra al catch`);
        res
        .status(500)
        .json({ success: false, message: 'server error while uploading video' });
    }    

};

// ROUTES
/* const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './store')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
}); */

const storage = multer.memoryStorage();

/* const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video')) {
        cb(null, true);
    } else {
        cb('invalid video file!', false);
    }
}; */

const uploads = multer({ storage: storage });

const router = express.Router();

router.get ("/", getMessage);
router.get ("/:id", getVideo);
router.post('/upload', uploads.single('video'), uploadVideo );

// MAIN FUNCTIONS

app.use("/videos",router); 

/*
const upload = multer({ dest: 'store/' });

app.post('/upload', upload.single('video'), async (req, res) => {
    try {
        const { originalname, size, mimetype, filename } = req.body.video; // req.file

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
*/

// OPEN PORT
const port = PORTAPI //8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
});

