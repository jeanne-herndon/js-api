const express = require('express');
const app = express();  // has get(),post(),put(),delete()
const db = require('./db');

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

function start(callback) {
    db.connect((err)=>{
        if (!err) {
            app.listen(process.env.PORT || 3000,() => {
                console.log(`listening on port ${process.env.PORT}`);
                callback(null)
            });
        } else {
          console.log(err);
          callback(err);
        }
    });    
}

app.get('/',(req,resp)=>{
    resp.send("REST API docs... coming soon!");
});

app.get('/api/locations',(req,resp)=>{
    let args = {
        brand: 'LC',
        address:'76258',
        radius:25
    };
    db.search(args,(docs) => {
        if (!docs) return resp.status(404).send("No LC locations in 76258 TX");
        resp.send(docs);
    });
});


app.get('/api/locations/:id',(req,resp)=>{
    db.getDoc(req.params.id,(docs) => {
        if (!docs) return resp.status(404).send("No locations with id:"+req.params.id);
        resp.send(docs);
    });
});

app.get('/api/locations/:address/:brand',(req,resp)=>{
    let args = {
        brand: req.params.brand,
        address:req.params.address,
        radius: 10
    };
    db.search(args,(docs) => {
        if (!docs) return resp.status(404).send("No LC locations in 76258 TX");
        resp.send(docs);
    });
});


app.get('/api/locations/:address/:brand/:radius',(req,resp)=>{
    let args = {
        brand: req.params.brand,
        address:req.params.address,
        radius:parseInt(req.params.radius)
    };
    db.search(args, (docs) => {
        if (!docs)
            return resp.status(404).send("No locations in " + args.address);
        resp.send(docs);
    });
});

start(()=>{});
