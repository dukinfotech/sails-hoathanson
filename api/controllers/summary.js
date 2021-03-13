module.exports = {
  fn: async function () {
    try {
      const LIMIT = 20;
      var ticker = this.req.param('ticker');
      ticker = ticker.toUpperCase();
      var user = this.req.session.me;
      if (user) {
        var watchlist = JSON.parse(user.watchlist[0].list);
        var flag = watchlist.indexOf(ticker)
      } else {
        var flag = null;
      }
      
      var data = await Summary.getSummaryData(flag, ticker, LIMIT);
      return data;
    } catch (error) {
      if (error == 404) {
        return this.res.notFound();
      }
    }
  }
};
