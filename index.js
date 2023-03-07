import express from "express";
import cors from "cors";
import multer from "multer";
import mysql from 'mysql';
/* import {Sequelize, DataTypes} from "sequelize"; */ 

// DATABASE // ----------------
const PORTAPI =  443;  // process.env.PORT ||

const DB_HOST = 'localhost';    // process.env.DB_HOST || 
const DB_USER = 'ubuntu';    // process.env.DB_USER ||
const DB_PASS = 'soporte';   // process.env.DB_PASS ||
const DB_NAME = 'videomanager';    // process.env.DB_NAME ||
const DB_PORT = 3306;  // process.env.DB_PORT ||
const DIALECT = 'mysql'; 

// Creating connection
let db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    port: DB_PORT
});

// Connect to MySQL server
db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed !", err);
    } else {
        console.log("Connected to Database");
    }
});

// MAIN CONFIG // ----------------
const app = express();
app.use(cors());

// CONTROLLER // ----------------
const getMessage = async (req, res)=>{
    console.log(`llega a getMessage`);
    res.json({success: true, message: 'welcome to backend zone!'});
}

const getVideo = async (req, res)=>{
    console.log(`llega a getVideo`);
    let query = `SELECT * FROM videos where idVideo = ?;`;
    
    // Creating queries
    db.query(query, [req.params.id],(err, rows) => {
            if (err) throw err;
            console.log("Select video:"+req.params.id);
        }
    );
}

const getAllVideos = async (req, res)=>{
    console.log(`llega a getAllVideos`); 
    let query = `SELECT * FROM videos;`;
    
    // Creating queries
    db.query(query, (err, rows) => {
            if (err) throw err;
            console.log("Select all videos");
        }
    );
}

const uploadVideo = async (req, res)=>{
    console.log(`llega a uploadVideo`); 
    
    try {
        console.log(`entra al try`);
        // Values to be inserted
		let path = req.file.path;
		let name = path.split('/').pop();
        let size = 1;
        let extension = 'mp4';

        console.log(`path ${path} name ${name}`)

        let query = `INSERT INTO videos (name, size, extension, path) VALUES (?, ?, ?, ?);`;
    
        // Creating queries
        db.query(query, [name, size, extension, path], (err, result) => {
                if (err) throw err;
                console.log("Row inserted with id = " + result.insertId); 
            }
        );

        console.log('query.insertId:'+query.insertId);

        res.status(200).json ({success: true, message: "Video Upload!"});    

        /* await VIDEO.create({
			name: name,
			size: 1,
			extension: '.mp4',
			path: path
		}) */    
        
        /* const video = req.file; //req.file.buffer
        
        if (!video) {
            const error = new Error('Error uploading the file')
            res.json({success: false, message: error})
            return;
        }  
        res.json({success: true, message: 'The file arrived to backend.'}) 
        */    
        /*const sql = 'INSERT INTO videos (thumb) SET ?';
		connection.query(sql, { video }, (err, result) => {
            if (err) {
                res.sendStatus(500).json ({message: "Error saving video."});
                return;
            }
            res.sendStatus(200).json ({message: "Video successfully uploaded."});
		});*/
		

        /* const { originalname, size, mimetype, filename } = req.body; */
        /* await VIDEO.create (req.body) */
        
    } catch (error) {
        console.log(`entra al catch`);
        res
        .status(500)
        .json({ success: false, message: error.message });
    }    
};

// ROUTES // ----------------
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../var/www/videomanager/store/') 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.mp4')
    }
});

const uploads = multer({ storage: storage });
/*const uploads = multer({ dest: './store/' });*/

const router = express.Router();

router.get ("/", getMessage);
/* router.get ("/:id", getVideo);
router.get ("/all", getAllVideos) */
router.post('/upload', uploads.single('video'), uploadVideo );

// MAIN FUNCTIONS // ----------------
app.use("/videos",router); 

// OPEN PORT // ----------------
const port = PORTAPI //8000
app.listen(port,()=>{
    console.log(`Server started on port ${port}`)
});