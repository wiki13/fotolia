var express = require('express');
var router = express.Router();
// jeśli jest sesja ale nie ma takiego id w bazie to jest przeniesiony do loginu

/* GET home page. */
router.get('/', function(req, res) {
  if(req.session.user_id){
    res.redirect('profile');
  }else{
    res.redirect('login');
  }
});

router.get('/login', function(req, res) {
  if(req.session.user_id){
    res.redirect('profile');
  }else{
    res.render('login');
  }
});

router.post('/login',function(req,res){
  if(!req.session.user_id){
    var login = false;
    req.db.collection('login').find({},{},function(error,item){
      if(error){
        console.log(error);
      }else{
        item.toArray(function(err,tab){
          for(var i=0;i<tab.length;i++){
            if(req.body.login==tab[i].login&&req.body.password==tab[i].password){
              login=true;
              req.session.user_id=tab[i].id_user;
            }
          }
          if(login){
            res.redirect('profile');
          }else{
            res.redirect('login');
          }
        });
      }
    });
  }else{
    res.redirect('profile');
  }
})


router.get('/logout', function(req,res){
  req.session =null;
  res.redirect('login');
});

module.exports = router;
