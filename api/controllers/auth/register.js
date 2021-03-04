module.exports = {
  // Validate input data
  inputs: {
    name: {
      type: 'string',
      required: true,
      maxLength: 120,
      minLength: 6,
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
  },
  fn: async function ({email, password, name}) {
    var newEmail = email.toLowerCase();
    await User.create(_.extend({
      name: name,
      email: newEmail,
      password: await sails.helpers.passwords.hashPassword(password)
    }))
    .intercept('E_UNIQUE', () => {
      this.req.addFlash('error', 'Email đã có người sử dụng');
      this.res.redirect('back');
    })
    .fetch();

    this.req.addFlash('success', 'Đăng ký thành công');
    this.res.redirect('login');
  }
};
