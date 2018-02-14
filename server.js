var express = require("express");
var app = express();

var mongoose = require("mongoose");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var path = require("path");
app.set("views", path.join(__dirname, "./views"));

app.set("view engine", "ejs");

// Displays all playtpi
app.get("/", function(req, res) {
    Platy.find({}, function(err, pack) {
        if (err) {
            console.log(err);
            res.render("index")
        } else if (pack !== null) {
            console.log(pack);
            res.render("index", {wholePack: pack});
        } else {
            res.render("index");
        }
    })
})

// Displays a form for making a new platypus
app.get("/platy/new", function(req, res) {
    console.log("hello")
    res.render("newPlaty");
});

// Deletes a platypus from the database by ID
app.post("/platy/destroy/:id", function(req, res) {
    Platy.findById(req.params.id, function(err, targetPlaty) {

        if(err) {
            console.log("Having trouble deleting!");
        } else {
            targetPlaty.remove();
            console.log("Found and removed!")
        }
    })

    res.redirect("/");
})

// Displays information about one platypus
app.get("/platy/:id", function(req, res) {
    Platy.findById(req.params.id, function(err, targetPlaty) {

        if(err) {
            console.log("Single information error");
        } else {
            res.render("info", {platy: targetPlaty});
        }
    })
});


// Logic for creating a new platypus in the database
app.post("/platy", function(req, res) {
    var platy = new Platy({name: req.body.name});

    platy.save(function(err) {
        if(err) {
            console.log("New platy error", err);
        } else {
            console.log("Successfully added a new Platy!");
            res.redirect("/")
        }
    })
})

// Shows a form to edit an existing platypus
app.get("/platy/edit/:id", function(req, res) {
    Platy.findById(req.params.id, function(err, targetPlaty) {

        if (err) {
            console.log("editiexisting error");
        } else {
            res.render("edit", {platy: targetPlaty});
        }
    })
})

// Logic for updating a platypus' information
app.post("/platy/:id", function(req, res) {
    Platy.findById(req.params.id, function(err, targetPlaty) {

        if(err) {
            console.log("update information error");
        } else {
            targetPlaty.name = req.body.name;
            targetPlaty.save(function(err, updatedPlaty) {
                if (err) {
                    console.log("there was an error updating the platy")
                } else {
                    console.log("update successful!")
                }
            })
            res.redirect("/");
        }
    })
})


app.listen(8001, function() {
    
    console.log("listening on port 8001");
})

mongoose.connect("mongodb://localhost/PlatyDash");

var PlatySchema = new mongoose.Schema({
    name: {type: String, required: true},
    createdOn: {type: Date, default: Date.now}
})

mongoose.model("Platy", PlatySchema);
var Platy = mongoose.model("Platy")
