module.exports = {
  fn: async function () {
    try {
      var ticker = this.req.param('ticker');
      ticker = ticker.toUpperCase();
      var user = this.req.session.me;
      var watchlist = JSON.parse(user.watchlist[0].list);
      var action;

      if (watchlist.indexOf(ticker) >= 0) {
        var index = watchlist.indexOf(ticker);
        watchlist.splice(index, 1);
        action = 'unfavorite';
      } else {
        watchlist.push(ticker);
        action = 'favorite';
      }

      this.req.session.me.watchlist[0].list = JSON.stringify(watchlist);
      this.req.session.save();
      
      await WatchList.update(user.watchlist[0].id, watchlist);
      this.res.ok(action);
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
