"use strict";

const express	= require('express');
const app	    = express();
const crypto    = require('crypto');
const multer	= require('multer');
const mime      = require('mime');
const morgan    = require('morgan');
const port      = process.env.PORT || 3113;
let timeInMs    = Date.now();
let storage	    = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + timeInMs + '.' + mime.extension(file.mimetype));
    });
  }
});
let upload = multer({ storage : storage }).single('fileUpload');

app.use(morgan('dev'));

app.use(express.static(__dirname + '/client'));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/client/index.html");
});

app.post('/api/upload',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		res.end("<h1>File uploaded successfully</h1>");        
	});
});

app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});