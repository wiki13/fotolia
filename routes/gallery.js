var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    if(req.query.id){
      req.db.collection("photo").find({id_user: parseInt(req.query.id)}).toArray(function(err,tab){
        if(err){
          console.log(err);
        }else{
          res.render('gallery',{"photos": tab});
        }
      });
    }else{
        res.redirect('profile');
    }
  }else{
    res.redirect('login');
  }
});

module.exports = router;
