var express = require('express');
var app = express();
var mongo = require('mongodb').MongoClient;

var insertedID;
var result;

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/index", function(req,res) {
    res.render("index");
});

app.get("/:id", (req,res) =>{
     
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

app.get("/new/*", (req, res) => {
    
    mongo.connect('mongodb://heroku_sv3gzsts:ghanjlbubvodkmbra92slljng9@ds041536.mlab.com:41536/heroku_sv3gzsts', function (err, db) {
        
        var urls = db.collection("urls");
        var urlValue = req.path.slice(5);
        
        var idInsertRand = Math.floor(10000*Math.random());
        
        urls.insert({"_id": idInsertRand, "url":urlValue}, function(err, docs) {
            insertedID = docs['insertedIds'][0];
            
            var isURL = (urlValue.includes("."))&&((urlValue.startsWith("http")));
        
            if(isURL) {
                var path = req.hostname + "/" + insertedID
                res.json({path, "url":urlValue});
                // res.json({req.baseURL + insertedID, "url":urlValue});
            } else {
                res.json({"urlShort":"Please send valid URL", "url":urlValue});
            }
        });
        
        db.close();
        
    })
})

app.get("/*", function(req,res) {
  res.redirect("/index");
});

app.listen(process.env.PORT);