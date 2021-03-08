module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getDataM10_2();
    return this.res.json(dataRows);
  }
};
