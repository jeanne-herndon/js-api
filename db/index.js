const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const Locations = require('./location');
const locations = new Locations();

// Connection URL 
const url = process.env.MGDB;
// Database Name
const dbName = 'josdb';
// Create a new MongoClient
const client = new MongoClient(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});


function getClient() {
    return client
}
 
function connect(callback) {
    client.connect(function(err) {
        if (err) {
          console.log("db connection failed:"+err);
          callback(err)
        }
        else {
          console.log("db connected");
          callback(null);    
        }
    });
}

function disconnect(callback) {
    setTimeout(()=>{
      client.close();
      callback('shutdown complete');
    },200);  
}

function search(args,callback) {
    locations.search(client.db(dbName),args,(docs) => {
        callback(docs);
    });
}

function getDoc(id,callback) {
    locations.getDocument(client.db(dbName),id,(docs) => {
        callback(docs);
    });
}

module.exports = {
    connect,
    disconnect,
    getClient,
    getDoc,
    search
}
