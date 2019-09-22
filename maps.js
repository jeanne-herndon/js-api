/**
Usage:
const Maps = require('./maps');
const maps=new Maps();
maps.getGeometry("Houston, TX",(geometry)=>{
    console.log(geometry);
});
*/
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GAPI
});

class Maps {
    getGeometry(address,callback) {
        googleMapsClient.geocode({address: address},(err,response)=>{
            if (!err) {
                 if (typeof callback === "function") {
                    callback(response.json.results[0].geometry)
                }
            }
        });
    }
}
module.exports = Maps;
