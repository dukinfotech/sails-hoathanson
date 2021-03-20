const passport = require('passport');

module.exports = {
  inputs: {
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    redirect: {
      type: 'string'
    }
  },
  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    try {
      passport.authenticate('local', (err, user, info) => {
        if (err || !user) {
          this.req.addFlash('error', 'Sai tên tài khoản hoặc mật khẩu');
          return exits.redirect('back');
        }
        
        if (! user.isActive) {
          this.req.addFlash('error', 'Tài khoản chưa được kích hoạt');
          return exits.redirect('back');
        }

        this.req.login(user, err => {
          if (err) {
            this.req.addFlash('error', 'Lỗi hệ thống');
            return exits.redirect('back');
          }
          sails.log('Người dùng ' + user.username + ' đã đăng nhập');
          return inputs.redirect ? exits.redirect(inputs.redirect) : exits.redirect('/');
        });
      })(this.req, this.res);

    } catch (error) {
      console.log(error);
    }
  }
};
