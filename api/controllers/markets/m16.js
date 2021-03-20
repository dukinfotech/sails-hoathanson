module.exports = {
  fn: async function () {
    try {
      var user = this.req.user;
      var watchlist = JSON.parse(user.watchlist[0].list);
      var data = await M16.getData(watchlist);
      return this.res.json({data});
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
