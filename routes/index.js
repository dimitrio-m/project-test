const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer')();

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
    res.render('signup', { groups: groups, message: '' });
  });

  router.post('/signup', multer.single('avatar'), function(req, res, next) {

    User.find({email: req.body.email}, (err, doc) => {
      if(err) next(err);
      else {
        console.log(doc);
        if(doc.length === 0) {
          const newUser = new User();
          newUser.email = req.body.email;
          newUser.firstname = req.body.firstname;
          newUser.lastname = req.body.lastname;
          newUser.group = groups.indexOf(req.body.group);
          newUser.avatar.fileType = req.file.mimetype;
          newUser.avatar.data = req.file.buffer;
          newUser.gender = req.body.gender;
          newUser.password = newUser.generateHash(req.body.password);
          console.log(req.file);
          newUser.save((err) => {
            if(err) next(err);
            else res.redirect('/login');
          });
        } else {
          res.render('signup', { groups: groups, message: 'Ese correo ya tiene una cuenta asociada.' });
        }
      }
    });
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/group', isLoggedIn, function(req, res, next) {
    res.render('group/index', {
      user: req.user,
      group: groups[req.user.group],
      categories: categories
    });
  });

  router.get('/:group/*', isLoggedIn, function(req, res, next) {
    if(groups.indexOf(req.params.group) === -1) {
      var err = new Error('Not Found');
      err.status = 404;
      res.status(err.status || 404);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
    else next();
  });

  router.get('/:group/create_post', isLoggedIn, function(req, res) {
    res.render('group/create_post', {
      user: req.user,
      group: groups[req.user.group],
      categories: categories
    });
  });

  router.post('/:group/create_post', multer.single('picture'), isLoggedIn, function(req, res) {
    const newPost = new Post();
    newPost.title = req.body.title;
    newPost.text = req.body.text;
    if(req.file) {
      newPost.picture.fileType = req.file.mimetype;
      newPost.picture.data = req.file.buffer;
    } else {
      newPost.picture.fileType = null;
    }
    newPost.author = req.body.author;
    newPost.group = groups.indexOf(req.params.group);
    newPost.category = categories.indexOf(req.body.category);
    console.log(req.file);
    newPost.save((err) => {
      if(err) next(err);
      else res.redirect('/group');
    });
  });

  router.get('/:group/:category', isLoggedIn, function(req, res, next) {
    if(categories.indexOf(req.params.category) === -1 || req.user.group !== groups.indexOf(req.params.group)) {
      var err = new Error('Not Found');
      err.status = 404;
      res.status(err.status || 404);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
    else Post.find({
      group: groups.indexOf(req.params.group),
      category: categories.indexOf(req.params.category)
    }
    , (err, docs) => {
      if(err) next(err);
      else res.render('group/category', {
        user: req.user,
        group: groups[req.user.group],
        categories: categories,
        category: req.params.category,
        posts: docs
      });
    });
  });

  router.get('/:group/:category/:post', isLoggedIn, function(req, res, next) {
    Post.findById(req.params.post, (err, doc) => {
      if(err) next(err);
      else res.render('group/post', {
        user: req.user,
        group: groups[req.user.group],
        categories: categories,
        category: req.params.category,
        post: doc
      });
    });
  });

  router.post('/:group/:category/:post/coment', isLoggedIn, function(req, res, next) {
    Post.findById(req.params.post, (err, doc) => {
      if(err) next(err);
      else {
        const aux = `${req.body.authorComment}: ${req.body.comment}`;
        console.log(aux);
        doc.comments.unshift(aux);
        doc.save((err) => {
          if(err) next(err);
          else res.render('group/post', {
            user: req.user,
            group: groups[req.user.group],
            categories: categories,
            category: req.params.category,
            post: doc
          });
        });
      }
    });
  });

}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
