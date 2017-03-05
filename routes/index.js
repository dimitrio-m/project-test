const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');

const groups = ['Grupo 1', 'Grupo 2', 'Grupo 3'];
const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6']

module.exports = function(router, passport) {

  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('/login', function(req, res){
    res.render('login', { message: req.flash('loginMessage') });
  });

  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/group',
    failureRedirect : '/login',
    failureFlash : true
  }));

  router.get('/signup', function(req, res) {
    res.render('signup', { groups: groups });
  });

  router.post('/signup', function(req, res, next) {

    const newUser = new User();
    newUser.email = req.body.email;
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.group = groups.indexOf(req.body.group);
    newUser.avatar = req.body.avatar;
    newUser.gender = req.body.gender;
    newUser.password = newUser.generateHash(req.body.password);
    console.log(newUser);
    console.log(req.body);
    newUser.save((err) => {
      if(err) next(err);
      else res.redirect('/login');
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/group',isLoggedIn ,function(req, res, next) {
    res.render('group/index', {
      user: req.user,
      group: groups[req.user.group],
      categories: categories
    });
  });

  router.get('/group/create_post', function(req, res) {
    res.render('group/create_post');
  });

  router.get('/group/:category', function(req, res, next) {
    res.render('group/category');
  });

  router.get('/group/:category/:post', function(req, res, next) {
    res.render('group/post');
  });

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
