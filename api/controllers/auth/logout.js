module.exports = {
  exits: {
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function ({}, exits) {
    this.req.logout();
    return exits.redirect('/login');
  }
};
