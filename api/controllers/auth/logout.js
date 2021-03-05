module.exports = {
  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function ({}, exits) {
    delete this.req.session.me;
    return exits.redirect('/login');
  }
};
