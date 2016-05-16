var express = require('express');
//var multer = require('multer'); od razu zapisuje plik w serwerze
var router = express.Router();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://fotolia256%40gmail.com:fotolia123@smtp.gmail.com');
/*var upload =multer({ dest: './public/profile/img/',
    limits: {
        fieldNameSize: 50,
        files: 1,
        fields: 5,
        fileSize: 1024 * 1024
    },
    rename: function(fieldname, filename) {
        return filename;
    },
    onFileUploadStart: function(file) {
        console.log('Starting file upload process.');
        if(file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return false;
        }
    },
    inMemory: true //This is important. It's what populates the buffer.
});

router.post('/',[ upload.any(), function(req, res) {
  console.log(req.files[0]);
 }]);

*/

var Busboy = require('busboy');

router.get('/', function(req, res) {
  if(req.session.user_id){
    res.redirect('profile');
  }else{
    if(req.query.e){
      if(req.query.e=="01"){res.render('register',{error:"taki login już istnieje"});}
      if(req.query.e=="02"){res.render('register',{error:"taki mail jest już zapisany w bazie"});}
      if(req.query.e=="03"){res.render('register',{error:"nie uzupełniłeś wszystkich pól"});}
      if(req.query.e=="04"){res.render('register',{error:"nie odpowiedni format zdjęcia! Tylko PNG"});}
      //res.render('register',{error:"nieznany błąd"})
    }else{
      res.render('register');
    }
  }
});


router.post('/',function(req,res){
      var busboy = new Busboy({ headers: req.headers });
      var base64data="";
      var filetype="";
      var user=[];
      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
          var buffer="";
          filetype=mimetype;
          file.setEncoding('base64');
    			// We are streaming! Handle chunks
    			file.on('data', function (data) {
    				// Here we can act on the data chunks streamed.
            buffer+=data;
    			});

    			// Completed streaming the file.
    			file.on('end', function () {
            base64data=buffer;
    				//console.log('Finished with ' + fieldname);
    			});
    	});

      busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
    			// Do something with non-file field.
          if(val!=""){  user.push(val);}

    	});
      busboy.on('finish', function () {
        if(user.length==5){
          if(filetype=="image/png"){
            var collectionlogin = req.db.collection('login');
            var collectionuser = req.db.collection('user');
            var collectionphoto = req.db.collection('photo');
            collectionlogin.find({login:user[0]}).toArray(function(err,tab){
                if(tab[0]){
                   return res.redirect('register?e=01');
                }else{
                  collectionlogin.find({email:user[2]}).toArray(function(err,tab){
                    if(tab[0]){
                       return res.redirect('register?e=02');
                    }else{
                      collectionlogin.find().limit(1).sort({$natural:-1}).toArray(function(err,tab){
                        if(err){
                          console.log(err);
                        }else{
                          var count = tab[0].id_login;
                          collectionuser.find().limit(1).sort({$natural:-1}).toArray(function(e,tab){
                            if(e){
                              console.log(e);
                            }else{
                              var c = tab[0].id_user;
                              collectionphoto.find().limit(1).sort({$natural:-1}).toArray(function(err,tab){
                                if(err){
                                  console.log(err);
                                }else{
                                  var countp = tab[0].id_photo;
                                  countp++; //photo
                                  count++; // login
                                  c++; //user
                                  collectionlogin.insert({login:user[0], password:user[1],
                                    id_user: c, id_login: count},{w:1},function(error,result){
                                      if(error){
                                        console.log(error);
                                      }else{
                                        collectionuser.insert({id_user: c, nick: user[3], email: user[2],
                                          about: user[4], favorite:[],likes:[], photo: countp },{w:1},function(error,result){
                                            if(error){
                                              console.log(error);
                                              collectionlogin.remove({id_login: count}, function(err,result){
                                                if(err){
                                                  console.log(err);
                                                }else{
                                                  console.log("nie utworzono użytkownika");
                                                  res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                }
                                              });
                                            }else{
                                              var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                                              collectionphoto.insert({id_photo:countp, id_user: c, date_add: datenow, comments:[], buffer: base64data, title: "profile"},{w:1}, function(e,result){
                                                if(e){
                                                  console.log(e);
                                                  collectionlogin.remove({id_login: count}, function(err,result){
                                                    if(err){
                                                      console.log(err);
                                                    }else{
                                                      console.log("nie utworzono użytkownika");
                                                      res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                    }
                                                  });
                                                  collectionuser.remove({id_user: c}, function(err,result){
                                                    if(err){
                                                      console.log(err);
                                                    }else{
                                                      console.log("nie utworzono użytkownika");
                                                      res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                    }
                                                  });
                                                }else{
                                                  req.db.collection("message").insert({id_user: c, messages:[]},{w:1},function(err,result){
                                                    if(err){
                                                      collectionlogin.remove({id_login: count}, function(err,result){
                                                        if(err){
                                                          console.log(err);
                                                        }else{
                                                          console.log("nie utworzono użytkownika");
                                                          res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                        }
                                                      });
                                                      collectionuser.remove({id_user: c}, function(err,result){
                                                        if(err){
                                                          console.log(err);
                                                        }else{
                                                          console.log("nie utworzono użytkownika");
                                                          res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                        }
                                                      });
                                                      collectionphoto.remove({id_photo:countp}, function(err,result){
                                                        if(err){
                                                          console.log(err);
                                                        }else{
                                                          console.log("nie utworzono użytkownika");
                                                          res.redirect('register',{error:"nie udało się utworzyć konta"});
                                                        }
                                                      });
                                                    }else{
                                                      /*var mailOptions = {
                                                        from: '"Fotila"', // sender address
                                                        to: user[2], // list of receivers
                                                        subject: 'Hello ', // Subject line
                                                        text: 'Hello', // plaintext body
                                                        html: 'oto twoje dane nowo utworzonego konta na Fotolia : <br>'+
                                                        'login '+user[0]+'<br>hasło'+user[1]+'<br><br><br> '+
                                                        'Proszę nie odpowiadać na maila, jest on generowany automatycznie' // html body
                                                      };
                                                      transporter.sendMail(mailOptions, function(error, info){
                                                        if(error){
                                                          return console.log(error);
                                                        }
                                                        console.log('Message sent: ' + info.response);
                                                        console.log('to: '+user[2]);
                                                      });*/
                                                      res.redirect('login');
                                                    }
                                                  });
                                                }
                                              });
                                            }
                                          });
                                      }
                                    });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
            });
          }else{
            res.redirect('register?e=04');
          }
        }else{
          res.redirect('register?e=03');
        }
      });
      req.pipe(busboy);
});


module.exports = router;
