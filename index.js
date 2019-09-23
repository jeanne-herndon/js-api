const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const express = require('express');
const app = express();  // has get(),post(),put(),delete()
const Locations = require('./location');
const locations = new Locations();

// Connection URL 
const url = process.env.MGDB;

// Database Name
const dbName = 'josdb';

// Create a new MongoClient
const client = new MongoClient(url);

// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
app.use(express.json(),
    function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Use connect method to connect to the Server
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  app.listen(process.env.PORT,() => console.log(`listening on port ${process.env.PORT}`));
 });

app.get('/',(req,resp)=>{
    resp.send("REST API docs... coming soon!");
});

app.get('/api/locations',(req,resp)=>{
    let args = {
        brand: 'LC',
        address:'TX',
        radius:200
    };
    locations.search(client.db(dbName),args,(docs) => {
        if (!docs) return resp.status(404).send("No locations in TX");
        resp.send(docs);
    });
});


app.get('/api/locations/:id',(req,resp)=>{
    locations.getDocument(client.db(dbName),req.params.id,(docs) => {
        if (!docs) return resp.status(404).send("No locations in TX");
        resp.send(docs);
    });
});

app.get('/api/locations/:address/:brand',(req,resp)=>{
    let args = {
        brand: req.params.brand,
        address:req.params.address,
        radius: 10
    };
    locations.search(client.db(dbName),args,(docs) => {
        if (!docs) return resp.status(404).send("No locations in TX");
        resp.send(docs);
    });
});


app.get('/api/locations/:address/:brand/:radius',(req,resp)=>{
    let args = {
        brand: req.params.brand,
        address:req.params.address,
        radius:parseInt(req.params.radius)
    };
    locations.search(client.db(dbName),args,(docs) => {
        if (!docs) return resp.status(404).send("No locations in TX");
        resp.send(docs);
    });
});
