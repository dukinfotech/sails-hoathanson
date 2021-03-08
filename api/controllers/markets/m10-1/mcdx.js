module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getData('criteria3', 'color3');
    return this.res.json(dataRows);
  }
};
