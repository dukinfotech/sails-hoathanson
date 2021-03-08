module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getDataM10_1('criteria3', 'color3');
    return this.res.json(dataRows);
  }
};
