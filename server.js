const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const connectMongo = require('connect-mongo');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
const busboy = require('connect-busboy');
const pass = require('./passport');
const routes = require('./routes/index');
const User = require('./models/User');

const app = express();
const MongoStore = connectMongo(session);

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/project-test');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET || 'estoSeSuponeQueEsSecreto',
  store: new MongoStore({ mongooseConnection: mongoose.connection, ttl: 2 * 60 * 60 }),
  resave: true,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public'), {
  maxage: 2628000
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(busboy());

pass(passport);
routes(app, passport);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});
