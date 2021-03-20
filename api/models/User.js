const bcrypt = require('bcrypt-nodejs');

module.exports = {
  tableName: 'users',
  migrate: 'alter',
  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 120,
      minLength: 6,
    },
    username: {
      type:'string',
      required: true,
      minLength: 5,
      maxLength: 16
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
    },
    password: {
      type: 'string',
      required: true,
      protect: true,
    },
    isSuperAdmin: {
      type: 'boolean',
      defaultsTo: false
    },
    isActive: {
      type: 'boolean',
      defaultsTo: false
    },
    watchlist: {
      collection: 'watchlist',
      via: 'user_id'
    },
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
  },
  customToJSON: function () {
    return __dirname.omit(this, ['password']);
  },
  beforeCreate: function (user, callback) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return callback(err);
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return callback(err);
        user.password = hash;
        return callback();
      });
    });    
  }
};
