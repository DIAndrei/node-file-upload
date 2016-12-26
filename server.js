"use strict";

/**
*
* WARNING: Uploading very large files, 
* or relatively small files in large numbers very quickly, 
* can cause your application to run out of memory when memory storage is used.
*
**/

const express	= require('express');
const app	    = express();
const crypto    = require('crypto');
const multer	= require('multer');
const mime      = require('mime');
const morgan    = require('morgan');
const port      = process.env.PORT || 3113;
let timeInMs    = Date.now();
let storage	= multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); /* destination folder for uploads. 
    **Note: in order for uploads to work, 
    you need to create a folder named "uploads" in the root directory */
  },
  filename: function (req, file, cb) {
	// function to rename the uploaded file
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + timeInMs + '.' + mime.extension(file.mimetype)); 	 
    }); /* this will generate a pseudo random filename,
    	* but will still use the same file extension 
	* to remove the file extension, delete ' + '.' + mime.extension(file.mimetype)) '
	*/
    
  }
});
let upload = multer({ storage : storage }).single('fileUpload');

// use morgan middleware to log HTTP requests
app.use(morgan('dev'));

app.use(express.static(__dirname + '/client'));

app.get('/',function(req,res){
      res.sendFile(__dirname + "/client/index.html");
});

app.post('/api/upload',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("<h1>Error uploading file.</h1>");
		}
		res.end("<h1>File uploaded successfully</h1>");        
	});
});

app.listen(port, () => {
  console.log(`App available on http://localhost:${port}`);
});
