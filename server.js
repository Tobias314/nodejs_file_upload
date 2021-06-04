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
        var dir = './tmp';
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
        console.log("uploading something")
        console.log(req.body)
        if (err) {
            console.log(err);
            return res.end("Something went wrong:(");
        }
        res.end("Upload completed.");

        req.files.forEach(file => {
            var oldPath = file.path;
            var newFolder = "./uploads/" + req.body.folder;
            if (!fs.existsSync(newFolder)) {
                fs.mkdirSync(newFolder)
            }
            var newPath = "./uploads/" + req.body.folder + "/" + file.filename;
            fs.rename(oldPath, newPath, function(err) {
                if (err) { throw err }
                console.log("Done!")
            });
            fs.unlink(oldPath, function(err){
                if(err) {throw err }
                console.log("Done deleting tmp file!")
            });
          });
    });
})

app.listen(3000);
