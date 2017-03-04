const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/login',function(req, res){
  res.render('login');
});

router.get('/signup',function(req, res){
  res.render('signup');
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/:group', function(req, res, next){
  res.render('group/index');
});

router.get('/:group/create_post', function(req, res){
  res.render('group/create_post');
});

router.get('/:group/category', function(req, res){
  res.render('group/category');
});

module.exports = router;
