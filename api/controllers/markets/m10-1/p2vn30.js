module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getData('criteria1', 'color1');
    return this.res.json(dataRows);
  }
};
