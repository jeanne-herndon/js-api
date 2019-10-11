const expect = require('chai').expect;
const db = require('../db/index');
const Maps = require('../db/maps');

describe('dependencies',function() {
    this.timeout(10000);

    describe('google maps', function(){
        const maps = new Maps();
        
        before(function(done) {
            maps.getGeometry('76258',(geometry) => {
               // console.log(geometry);
                this.geometry=geometry;
                done();
            }); 
        });

        it('maps return geometry for 76258',function(){    
            expect(this.geometry).is.not.null;
            expect(this.geometry.location).is.not.null;
            expect(this.geometry.location.lat).is.not.null;
        });
    });

    describe('mongo db', function() {
 
        before(function(done){
            db.connect(function(err) {
                if (err) {
                    throw new Error("connection failed... exiting");
                  }  else {
                    console.log("before: Connected successfully to server");
                    done();   
                  }
            });  
        });
        
        after(function(done){
            db.disconnect((msg)=>{
            console.log('after:'+msg);
            done();
            });  
        });
    
        it('results contain one doc for siteNo 100',function(done){
            let siteNo='0011';
            db.getDoc(siteNo,(docs)=>{
                expect(docs).is.not.null;
                expect(docs.length).to.equal(1);
                expect(docs[0].siteNo).eq(siteNo);
                done();
            });
        });

        it('results contain 3 docs for 76258/30 miles',function(done){
            let args = {
                brand: 'LC',
                address:'76258',
                radius:30
            };
            db.search(args,(docs)=>{
                expect(docs).is.not.null;
                expect(docs.length).to.equal(3);
                done();
            });
        });
     });
    
});

