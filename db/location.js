const assert = require('assert');
const Maps = require('./maps');
const maps=new Maps();
const meterPerMile = 1609.34;

class Locations {
    search(db,args,callback) {
      maps.getGeometry(args.address,(geometry) => {
          findDocuments(db,geometry,args,(docs) => {  
                callback(docs);
          });    
      });
    }

    getDocument(db,id,callback) {
      let idStr = id.padStart(4,'0');
      const collection = db.collection('locations');
      collection.find({'siteNo': idStr})
        .toArray((err,docs) => {
            assert.equal(err, null);
            if (typeof callback === "function") {
              callback(docs);
            }
        });
    }

}

function findDocuments(db,geometry,args,callback) {
    const collection = db.collection('locations');
    collection.find(
        { 'brand': args.brand,
          'geometry':
          { $near :
            { $geometry:
              { type: "Point",  coordinates: [ 
                   geometry.location.lng , geometry.location.lat
                ] },
                $maxDistance: args.radius * meterPerMile
            }
          }
        }
      ).toArray(function(err, docs) {
        assert.equal(err, null);
        if (typeof callback === "function") {
           callback(docs);
        }
    })
}

module.exports = Locations;
