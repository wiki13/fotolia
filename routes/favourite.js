var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection("user").find({id_user: req.session.user_id}).toArray(function(err,tab){
      if(err){
        console.log(err);
      }else{
        var users = [];

        for(var i=0; i<tab[0].favorite.length; i++){
          users.push(parseInt(tab[0].favorite[i].user));
        }

        req.db.collection("user").find({id_user: { $in:users}}).toArray(function(err,tab2){
          if(err){
            console.log(err);
          }else{
            var profilephotos =[];
            for(var i=0; i<tab2.length; i++){
              profilephotos.push(tab2[i].photo);
            }
            req.db.collection("photo").find({id_photo: {$in: profilephotos}}).toArray(function(err,tabphoto){
              for(var i=0; i<tab2.length; i++){
                for(var j=0; j<tabphoto.length;j++){
                  if(tab2[i].photo==tabphoto[j].id_photo){
                    tab2[i].photo=tabphoto[j].buffer;
                  }
                }
              }
              res.render('liked-you',{title:"Twoi Ulubieni","users":tab2});
            });

          }
        });
      }
    });
  }else{
      res.redirect('login');
  }
});

module.exports = router;
