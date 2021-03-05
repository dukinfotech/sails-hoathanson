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
  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    var userRecord = await User.findOne({
      email: inputs.email.toLowerCase(),
    });

    if(! userRecord) {
      this.req.addFlash('error', 'Email hoặc mật khẩu không đúng');
      this.req.addFlash('email', inputs.email);
      return exits.redirect('back');
    }

    await sails.helpers.passwords.checkPassword(inputs.password, userRecord.password)
    .intercept('incorrect', () => {
      this.req.addFlash('error', 'Email hoặc mật khẩu không đúng');
      this.req.addFlash('email', inputs.email);
      return exits.redirect('back');
    });

    delete userRecord.password;
    this.req.session.me = userRecord;
    return exits.redirect('/');
  }
};
