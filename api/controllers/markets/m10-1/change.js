module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getDataM10_1('criteria2', 'color2');
    return this.res.json(dataRows);
  }
};
