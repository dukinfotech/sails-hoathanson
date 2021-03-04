module.exports = {
  inputs: {
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  },
  fn: async function ({email, password}) {
    var userRecord = await User.findOne({
      email: email.toLowerCase(),
    });

    if(! userRecord) {
      this.req.addFlash('error', 'Email hoặc mật khẩu không đúng');
      this.res.redirect('back');
    }

    await sails.helpers.passwords.checkPassword(password, userRecord.password)
    .intercept('incorrect', () => {
      this.req.addFlash('error', 'Email hoặc mật khẩu không đúng');
      this.res.redirect('back');
    });

    delete userRecord.password;
    this.req.session.me = userRecord;
    this.res.redirect('/');
  }
};
