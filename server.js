//to complete:
//find way to refer to domain without explicitly hardcoding 'https://apiprojects-benws.c9users.io/' into programming
//create how-to-use homepage


var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var insertedID;
var result;

//set view directory
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/index", function(req,res) {
    res.render("index");
});

//set up method for processing redirects

app.get("/:id", (req,res) =>{
     
    //database connection
    mongo.connect('mongodb://heroku_sv3gzsts:ghanjlbubvodkmbra92slljng9@ds041536.mlab.com:41536/heroku_sv3gzsts', function (err, db) {
        
        var urls = db.collection("urls");
        
        urls.find({"_id": parseInt(req.params.id)}).toArray( (err, docs) => {
            if (docs[0] != null) {
                var urlResult = docs[0]["url"];
                res.redirect(urlResult);
                res.end()
            } else {
                res.end("No redirect defined for this URL")
            }
        })
        
        db.close();
    })
})

//set up get method for processing requests

app.get("/new/*", (req, res) => {
    
    //database connection
    mongo.connect('mongodb://heroku_sv3gzsts:ghanjlbubvodkmbra92slljng9@ds041536.mlab.com:41536/heroku_sv3gzsts', function (err, db) {
        
        var urls = db.collection("urls");
        var urlValue = req.path.slice(5);
        
        //extract everything after 'new'
        
        var idInsertRand = Math.floor(10000*Math.random());
        
        urls.insert({"_id": idInsertRand, "url":urlValue}, function(err, docs) {
            insertedID = docs['insertedIds'][0];
            
            var isURL = (urlValue.includes("."))&&((urlValue.startsWith("http")));
        
            if(isURL) {
                res.json({"urlShort":"https://apiprojects-benws.c9users.io/" + insertedID, "url":urlValue});
            } else {
                res.json({"urlShort":"Please send valid URL", "url":urlValue});
            }
            
            res.end();
        });
        
        db.close();
        
    })
})

app.get("/*", function(req,res) {
  res.redirect("/index");
  // res.end("This is the index page");
});

app.listen(process.env.PORT);