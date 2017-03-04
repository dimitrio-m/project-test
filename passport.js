const passport = require('passport-local');
const User = require('./models/User');

const LocalStrategy = passport.Strategy;

module.exports = function(passport) {

  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  (req, email, password, done) => {
    User.findOne({ 'email': email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'Ese correo no tiene un usuario asociado'));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Contraseña invalida.'));
      }
      return done(null, user);
    });
  }));
}
