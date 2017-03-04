const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Group = require('../models/Group');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports = function(router, passport) {

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
    //res.render('group/index');
    next();
  });

  router.get('/:group/create_post', function(req, res){
    res.render('group/create_post');
  });

  router.get('/:group/:category', function(req, res, next){
    res.render('group/category');
  });

  router.get('/:group/:category/:post', function(req, res, next){
    res.render('group/post');
  });

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
