module.exports = {
  fn: async function () {
    var extra = this.req.param('extra');
    if (['vn30', 'bds', 'tcnh', 'dk', '5', '6'].includes(extra)) {
      return this.res.render('pages/markets/m15-extra');
    } else {
      return this.res.notFound();
    }
  }
};
