var express = require('express');
var multer  = require('multer');
var fs  = require('fs');

var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

console.log("START")

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(req)
        console.log(req.body)
        var dir = './uploads/' + "test";
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files',12);
app.post('/upload', function (req, res, next) {
    upload(req, res, function (err) {
        console.log(req.body.folder)
        if (err) {
            console.log(err);
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");
    });
})

app.listen(3000);
