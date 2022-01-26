const express = require("express")
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const cors = require("cors");
const { Int32 } = require("bson");
const app = express()


mongoose.connect("mongodb://localhost:27017/weatherdb", { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected to database")
})

app.use(cors(), express.json())
app.get("/", function (req, res) {
    res.send("Connected to server")
})

app.listen(5000, function () {

})

const db = mongoose.connection

app.get("/database", function (req, res) {
    var collection = db.collection("user");
    var query = { id: { $gte: 2 } }

    collection.find(query).toArray(function (err, result) {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(result)
        }
    });
})
/* == WEATHER == */

// Get forecast
app.get("/forecast/:ort/:days", function (req, res) {
    var paramDays = parseInt(req.params.days)
    let fromdate = new Date("2020-06-09")
    let todate = new Date("2020-06-09")
    todate.setDate(todate.getDate() + paramDays);

    fromdate = fromdate.toISOString().split('T')[0]
    todate = todate.toISOString().split('T')[0]


    var collection = db.collection("forecast");
    var query = { fromtime: { $gte: fromdate }, totime: { $lte: todate }, name: req.params.ort }

    collection.find(query).toArray(function (err, result) {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(result)
        }
    });
})

// Get climatecodes
app.get("/climatecodes", function (req, res) {
    var collection = db.collection("climatecodes");
    var query = {}

    collection.find(query).toArray(function (err, result) {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(result)
        }
    });
})

// Get ort
app.get("/ort/:ort", function (req, res) {
    var collection = db.collection("ort");
    var query = { name: req.params.ort }

    collection.find(query).toArray(function (err, result) {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(result)
        }
    });
})


/* == CHAT == */


// Get comments
app.get("/comments/:ort", function (req, res) {
    var collection = db.collection("comments");
    var query = { location: req.params.ort }

    collection.find(query).toArray(function (err, result) {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(result)
        }
    });

    /*     let sql = `SELECT *,comment.id as commentid,count(likes.comment) as nolikes FROM comment,user left outer join likes on likes.comment=comment.id where location='${req.params.ort}' and user.id=comment.author group by comment.id`
    db.all(sql, [], (err, row) => {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(row)
        }
    }) */
})


/* == USER == */

// Get users
app.get("/user", function (req, res) {
    let sql = `SELECT * FROM 'user'`
    db.all(sql, [], (err, row) => {
        if (err) {
            throw err
        }
        else {
            res.type("application/json")
            res.status(200).send(row)
        }
    })
})

// Add a user
app.post("/user", express.json(), function (req, res) {
    let sql = `INSERT INTO user VALUES (${req.body.id}, '${req.body.username}', '${req.body.email}', '${req.body.favlocation}', null);`
    db.run(sql)

    res.status(201).json(req.body)
})
