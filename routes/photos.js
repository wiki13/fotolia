var express = require('express');
var Busboy = require('busboy');
var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.user_id){
    res.redirect('login');
  }else{
    req.db.collection("photo").find({id_user:req.session.user_id},function(err,item){
      if(err){
        console.log(err);
      }else{
        item.toArray(function(err,tab){
          if(err){
            console.log(err);
          }else{
            req.db.collection("user").find({}).toArray(function(err,tab_user){
                //res.render('photos',{"photos":tab, "users":tab_user});

              for(var i=0; i<tab.length;i++){
                for(var j=0; j<tab[i].comments.length;j++){
                  for(var z=0; z<tab_user.length;z++){
                    if(tab_user[z].id_user==tab[i].comments[j].id_user_add){
                      tab[i].comments[j].nick=tab_user[z].nick;
                      break;
                    }
                  }
                }
              }
              if(req.query.e=="01"){
                res.render('photos',{"photos":tab,error:"zły format pliku"});
              }else if (req.query.e=="02") {
                res.render('photos',{"photos":tab,error:"dodano nowe zdjęcie"});
              }else if (req.query.e=="03") {
                res.render('photos',{"photos":tab,error:"usunięto zdjęcie"});
              }else if (req.query.e=="04") {
                res.render('photos',{"photos":tab,error:"błądu usunięcia zdjęcia"});
              }else if (req.query.e=="05") {
                res.render('photos',{"photos":tab,error:"błądu dodania zdjęcia"});
              }else{
                res.render('photos',{"photos":tab});
              }
            });
          }
        });
      }
    });
  }
});



router.post('/',function(req,res){
  var busboy = new Busboy({ headers: req.headers });
  var base64data="";
  var filetype="";
  var title="";

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      var buffer="";
      filetype=mimetype;
      file.setEncoding('base64');

      file.on('data', function (data) {
        buffer+=data;
      });
      file.on('end', function () {
        base64data=buffer;
      });
  });

  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
      if(val!=""){title=val;}
  });

  busboy.on('finish', function () {
    var titleRE = new RegExp("^\-\-[0-9][0-9]*\-\-$");
    if(titleRE.test(title) == true){
        var id = title.substr(2,title.length-4);
        var collectionphoto = req.db.collection('photo');
        collectionphoto.remove({id_photo:parseInt(id,10)},function(err,result){
          if(err){
            console.log(err);
            res.redirect('photos?e=04');
          }else{
            res.redirect('photos?e=03');
          }
        });
    }else{
        if(filetype=="image/png" && title!=""){
          var collectionphoto = req.db.collection('photo');
          var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
          collectionphoto.find().limit(1).sort({$natural:-1}).toArray(function(err,tab){
            if(err){
              console.log(err);
            }else{
              var count = tab[0].id_photo;
              count++;
              collectionphoto.insert({id_photo:count, id_user: req.session.user_id, date_add: datenow, comments:[], buffer: base64data, "title": title},
              {w:1}, function(e,result){
                if(e){
                  console.log(e);
                  res.redirect('photos?e=05');
                }else{
                  res.redirect('photos?e=02');
                }
              });
            }
          });
        }else{
          res.redirect('photos?e=01');
        }
    }
  });

    req.pipe(busboy);
});

module.exports = router;
