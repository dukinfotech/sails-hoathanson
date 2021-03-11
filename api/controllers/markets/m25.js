module.exports = {
  fn: async function () {
    var user = this.req.session.me;
    var watchlist = JSON.parse(user.watchlist[0].list);
    var data = await M25.getData(watchlist);
    return this.res.json({data});
  }
};
