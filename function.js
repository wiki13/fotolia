/*var fs = require("fs");
var mongo = require("mongodb").MongoClient;


var image = "logo.png";
*/
/*function zakoduj (image){
  fs.readFile(image, 'binary', function(err, original_data){
    //fs.writeFile('image_orig.png', original_data, 'binary', function(err) {});
      var base64Image = new Buffer(original_data, 'binary').toString('base64');
    */  /*console.log("base64 str:");
      console.log(base64Image);
      console.log(base64Image.length);*/
/*  });
}
function odkoduj (image){
  fs.readFile(image, 'binary', function(err, original_data){;
      var decodedImage = new Buffer(base64Image, 'base64').toString('binary');
      *//*console.log("decodedImage:");
      console.log(decodedImage);*/
    //  fs.writeFile('image_decoded.png', decodedImage, 'binary', function(err) {});
  /*});
}*/

/*mongo.connect("mongodb://localhost/",function(err,db){
  var myDB=db.db("fotolia");
  fs.readFile(image, 'binary', function(err, original_data){
    var base64Image = new Buffer(original_data, 'binary').toString('base64');
    myDB.collection("user",function(err,user){
      user.findAndModify({id_user: 1},{},{$set:{"photo":base64Image}},
      {w:1,new:true},function(err,doc){
        console.log(doc);
      });
    });
  });
});*/
express = require('express');
app = express();

console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
