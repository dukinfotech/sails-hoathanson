module.exports = {
  fn: async function () {
    var dataRows = await M10.getDataM10_1('criteria1', 'color1');
    return this.res.json(dataRows);
  }
};
