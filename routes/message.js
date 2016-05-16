var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection("message").find({id_user:req.session.user_id}).toArray(function(err,tab){
      if(err){
        console.log(err);
      }else{
        var tabuser=[];
        for(i=0;i<tab[0].messages.length;i++){
          tabuser.push(tab[0].messages[i].id_user_send);
        }
        req.db.collection("user").find({id_user:{$in:tabuser}}).toArray(function(err,tab2){
          if(err){
            console.log(err);
          }else{
            for(var i=0; i<tab[0].messages.length;i++){
              for(var j=0; j<tab2.length; j++){
                if(tab[0].messages[i].id_user_send==tab2[j].id_user){
                  tab[0].messages[i].nick=tab2[j].nick;
                }
              }
            }
            res.render('message',{"tab":tab});
          }
        });
      }
    });
  }else{
    res.redirect('login');
  }
});

router.post('/',function(req,res){
  if(req.session.user_id){
    if(req.body.delete="true"){
      req.db.collection("message").update({id_user:req.session.user_id},
      {$pull:{messages:{"id_user_send":parseInt(req.body.usersend),"date":req.body.date}}}, function(err){
        if(err){
          console.log(err);
          res.send("error");
        }else{
          res.send("ok");
        }
      });
    }else{
      var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      req.db.collection("message").update({id_user: parseInt(req.body.usersend)},
      {$push:{messages:{"id_user_send":parseInt(req.session.user_id),"text":req.body.text, "title":req.body.title, "date":datenow}}},
      function(err,item){
        if(err){
          console.log(err);
          res.send("error");
        }else{
          res.send("ok")
        }
      });
    }
  }
});


module.exports = router;
