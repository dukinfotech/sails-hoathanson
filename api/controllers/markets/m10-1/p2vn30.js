module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getDataM10_1('criteria1', 'color1');
    return this.res.json(dataRows);
  }
};
