const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcrypt-nodejs');

// Serialize the User
passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

// Deserialize the User
passport.deserializeUser(function (id, callback) {
  User.findOne({id}).populate('watchlist').exec(function (err, user) {
    callback(err, user);
  });
});

// Local
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, function (username, password, callback) {
  User.findOne({username}).exec(function (err, user) {
    if (err) return callback(err);
    if (! user) return callback(null, false, {message: 'Username tồn tại'});

    bcrypt.compare(password, user.password, function (err, result) {
      if (! result) return callback(null, false, {message: 'Sai mật khẩu'});
      return callback(null, user, {message: 'Đăng nhập thành công'});
    });
  });
}));