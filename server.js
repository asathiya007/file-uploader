const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const Grid = require("gridfs-stream");

app = express(); 
app.use(express.json());
app.use(cors());

// connect to mongoDB
mongoose.set('useUnifiedTopology', true);
const mongoURI = "mongodb+srv://akshay_default:akshay_default@file-uploader-72v4i.mongodb.net/test?retryWrites=true&w=majority"; 
const conn = mongoose.createConnection(mongoURI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
});
let gfs; 
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
    console.log("mongoDB connected"); 
}); 

// create storage engine 
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }

                const filename = file.originalname; 
                const fileInfo = {
                    filename, 
                    bucketName: "uploads"
                }
                resolve(fileInfo);
            }); 
        }); 
    }
}); 
const upload = multer({storage});

// upload image 
app.post("/", upload.single("file"), (req, res, next) => {
    res.json(req.files);
}); 

// retrieve image 
app.get("/:filename", (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        // check if file 
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "no file exists"
            }); 
        }

        // check if image 
        if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
            // read output to browser 
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({
                err: "not an image"
            }); 
        }
    }); 
}); 

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
