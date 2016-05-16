var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
        req.db.collection("photo").find({}).toArray(function(err,tab){
          if(err){
            console.log(err);
          }else{
            tab.sort(function(){
               return Math.random() - 0.5;
            });
            var begin2 = Math.floor(Math.random()*(tab.length-1));
            var begin = begin2;
            var photos_id=[];
            for(var i = 0; i<10; i++){
              if(begin+i==begin2&&i>0){
                break;
              }else{
                if(begin+i==tab.length){
                  begin=i*-1;
                }
                photos_id.push(tab[begin+i]);
              }
            }

              if(req.query.q){


                /*......... profile innych użytkowników .......*/

                var user = parseInt(req.query.q,10);
                if(user!=req.session.user_id){
                  req.db.collection('user').find({id_user: user},{},function(error,item){
                    if(error){
                      console.log(error);
                    }else{
                      item.toArray(function(err,tab){
                        if(tab[0]){
                          req.db.collection("photo").find({id_user:tab[0].id_user}, function(err,item){
                            if(err){
                              console.log(err);
                            }else{
                              item.toArray(function(err,tab2){
                                var comments=0;
                                var newphotos=[];
                                for(var i=0; i<tab2.length; i++){
                                  comments+=tab2[i].comments.length;
                                  if(tab2[i].id_photo==tab[0].photo){
                                    tab[0].photo=tab2[i].buffer;
                                  }
                                }
                                tab2.sort(function(a,b){
                                  return new Date(b.date_add) - new Date(a.date_add);
                                });

                                for(var i=0; i<tab2.length/* && i<10*/; i++){
                                  newphotos.push({"buffer":tab2[i].buffer,"id_photo":tab2[i].id_photo});
                                }

                                res.render('profile',{ user:tab[0], photos: photos_id,
                                  "comments":comments, "like": tab[0].likes.length,
                                  "favorite":tab[0].favorite.length,"newphotos":newphotos});
                              });
                            }
                          });

                        }else{
                          res.render('not_found',{message:"nie znaleziono takiego użytkownika"});
                        }
                      });
                    }
                  });
                }else{
                  res.redirect('profile');
                }



              }else{

                /*............... profil użytkownika .....*/

                req.db.collection('user').find({id_user:req.session.user_id},{},function(error,item){
                  if(error){
                    console.log(error);
                  }else{
                    item.toArray(function(err,tab){
                      req.db.collection("photo").find({id_photo:tab[0].photo}, function(err,item){
                        if(err){
                          console.log(err);
                        }else{
                          item.toArray(function(err,tab2){
                            req.db.collection("photo").find({id_user:req.session.user_id}).toArray(function(err,tab2){
                              if(err){
                                console.log(err);
                              }else{
                                var comments=0;
                                //var tabcomments = [];
                                var tabcomments= [];
                                for (var i=0; i<3 ;i++){
                                  var nrphoto=Math.floor(Math.random()*(tab2.length-1));
                                  if(tab2[nrphoto].comments.length>1){
                                    var nrcomment =Math.floor(Math.random()*(tab2[nrphoto].comments.length-1));
                                    tabcomments.push({"photo":tab2[nrphoto].buffer,
                                    "comment":tab2[nrphoto].comments[nrcomment].text});
                                  }
                                }
                                for(var i=0; i<tab2.length; i++){
                                  comments+=tab2[i].comments.length;
                                /*  if(tab2[i].comments.length){
                                    for(var j=0; j<tab2[i].comments.length; j++){
                                      tab2[i].comments[j].photo_id=tab2[i].id_photo;
                                      tabcomments.push(tab2[i].comments[j]);
                                    }
                                  }*/

                                  if(tab2[i].id_photo==tab[0].photo){
                                    tab[0].photo=tab2[i].buffer;
                                  }
                                }
                                if(tabcomments.length>0){
                                  res.render('profile',{ profile:"main","user":tab[0],
                                   "photos": photos_id, "comments":comments, "like":tab[0].likes.length,
                                   "favorite":tab[0].favorite.length,"random_comments":tabcomments});
                                }else{
                                  res.render('profile',{ profile:"main","user":tab[0],
                                   "photos": photos_id, "comments":comments, "like":tab[0].likes.length,
                                   "favorite":tab[0].favorite.length});
                                }

                              }
                            });
                          });
                        }
                      });
                    });
                  }
                });
              }
            }
          });
  }else{
      res.redirect('login')
  }
});

router.post('/', function(req, res) {
  if(req.query.q){
    if(req.body.f=="true"){
      req.db.collection("user").find({id_user: parseInt(req.query.q)}).toArray(function(err,tab){
        if(err){
          console.log(err);
        }else{
          var is=false;
          for(var i=0; i<tab[0].likes.length; i++){
            if(tab[0].likes[i].user==req.session.user_id){
              is=true;
              break;
            }
          }
          if(is==false){
            var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
            req.db.collection("user").update({id_user: parseInt(req.query.q)},{$push:{likes:{"user":req.session.user_id,"date":datenow}}},{upsert:true},
            function(err){
                if(err){
                  console.log(err);
                }else{
                  req.db.collection("user").update({id_user:parseInt(req.session.user_id)},{$push:{favorite:{"user":req.query.q, "date":datenow}}},
                  {upsert: true},function(err){
                    if(err){
                      console.log(err);
                    }else {
                      return res.send("ok");
                    }
                  });
                }
            });
          }else{
            res.send("już polubiłeś tą osobę");
          }
        }
      });
    }else{
      var datenow = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      req.db.collection("message").update({id_user: parseInt(req.query.q)},
      {$push:{messages:{"id_user_send":parseInt(req.session.user_id),"text":req.body.text, "title":req.body.title, "date":datenow}}},
      function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect("profile?q="+req.query.q)
        }
      });
    }
  }
});


module.exports = router;
