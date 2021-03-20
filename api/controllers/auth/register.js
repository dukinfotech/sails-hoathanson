module.exports = {
  // Validate input data
  inputs: {
    username: {
      type:'string',
      required: true,
      minLength: 5,
      maxLength: 16,
    },
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
  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    var newEmail = inputs.email.toLowerCase();
    await User.create(_.extend({
      username: inputs.username,
      name: inputs.name,
      email: newEmail,
      password: inputs.password
    }))
    .intercept('E_UNIQUE', () => {
      this.req.addFlash('error', 'Email đã có người sử dụng');
      this.req.addFlash('registerData', JSON.stringify({name: inputs.name, email: inputs.email}));
      return exits.redirect('back');
    })
    .intercept({name:'UsageError'}, ()=> {
      this.req.addFlash('error', 'Lỗi hệ thống');
      return exits.redirect('back');
    })
    .fetch();

    this.req.addFlash('success', 'Đăng ký thành công');
    return exits.redirect('back');
  }
};
