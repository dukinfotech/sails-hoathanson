module.exports = {
  fn: async function () {
    try {
      const LIMIT = 20;
      var ticker = this.req.param('ticker');
      ticker = ticker.toUpperCase();
      var user = this.req.user;
      if (user) {
        var watchlist = JSON.parse(user.watchlist[0].list);
        var flag = watchlist.indexOf(ticker)
      } else {
        var flag = -1;
      }
      var result = await Summary.getSummaryData(flag, ticker, LIMIT);
      return result;
    } catch (error) {
      console.log(error);
      if (error == 404) {
        return this.res.notFound();
      } else {
        return this.res.serverError();
      }
    }
  }
};
