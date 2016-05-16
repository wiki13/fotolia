var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection("user").find({id_user: req.session.user_id}).toArray(
      function(err,tab){
        if(err){
          console.log(err);
        }else{
          res.render('settings',{"user":tab[0]});
        }
      }
    );
  }else{
    res.redirect('login');
  }
});

router.post('/', function(req,res){
  console.log(req.body);
  console.log(req.params);
});


module.exports = router;
