var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  if(req.query.q){
      req.db.collection("photo").find({id_photo: parseInt(req.query.q) }).toArray(function(err,tab){
        if(err){
          console.log(err);
        }else{
          if(tab[0]!=undefined){
            req.db.collection("user").find({}).toArray(function(err,tab_user){
                if(err){
                  console.log(err);
                }else {
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
                  res.render('show',{"photos":tab});
                }
            });
          }else{
            res.render('not_found',{message:"nie znaleziono takiego zdjęcia"});
          }
        }
      });
  }else{
    res.redirect('profile');
  }
});

router.post('/',function(req,res){
    if(req.query.q){
      req.db.collection("photo").find({id_photo: parseInt(req.query.q) }).toArray(function(err,tab){
        if(err){
          console.log(err);
        }else {
          if(tab[0]!=undefined){
            var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

             req.db.collection("photo").update({id_photo: parseInt(req.query.q) },
            {$push:{comments:{id_user_add:req.session.user_id, "date":datenow, text:req.body.comment}}},
            {upsert: true},function(err){
                if(err){
                  console.log(err);
                }else{
                  res.redirect('show?q='+req.query.q);
                }
            });
          }else{
            res.render('not_found',{message:"nie znaleziono takiego zdjęcia"});
          }
        }
      });
    }else{
      res.render('not_found',{message:"nie znaleziono takiego zdjęcia"});
    }
});


module.exports = router;
