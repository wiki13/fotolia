var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection("user").find({likes:{$elemMatch:{user: req.session.user_id}}}).toArray(
      function(err,tab){
        if(err){
          console.log(err);
        }else{
          var phototab = [];
          for(var i=0; i<tab.length;i++){
            phototab.push(parseInt(tab[i].photo));
          }
          req.db.collection("photo").find({id_photo:{$in: phototab}}).toArray(
            function(err,tab2){
              if(err){
                console.log(err);
              }else{
                for(var i=0; i<tab.length;i++){
                  for(var j=0; j<tab2.length; j++){
                    if(tab[i].photo==tab2[j].id_photo){
                      tab[i].photo=tab2[j].buffer;
                    }
                  }
                }
                res.render('liked-you',{title:"Użytkownikcy którzy cię polubili","users":tab});
              }
            }
          );
        }
      }
    );
  }else{
    res.redirect('login')
  }
});

module.exports = router;
