//to complete:
//find way to refer to domain without explicitly hardcoding 'https://apiprojects-benws.c9users.io/' into programming
//create how-to-use homepage


var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var insertedID;
var result;

//set up method for processing redirects

app.get("/:id", (req,res) =>{
     
    //database connection
    mongo.connect('mongodb://localhost:27017/' + 'local', function (err, db) {
        
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
    mongo.connect('mongodb://localhost:27017/' + 'local', function (err, db) {
        
        var urls = db.collection("urls");
        var urlValue = req.path.slice(5);
        
        //extract everything after 'new'
        
        var idInsertRand = Math.floor(10000*Math.random());
        
        urls.insert({"_id": idInsertRand, "url":urlValue}, function(err, docs) {
            insertedID = docs['insertedIds'][0];
            
            var isURL = (urlValue.includesprocess.env.PORT("."))&&((urlValue.startsWith("http")));
        
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

app.listen(process.env.PORT);