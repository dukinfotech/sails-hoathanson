module.exports = {
  fn: async function () {
    var dataRows = await Heatmap.getData('criteria2', 'color2');
    return this.res.json(dataRows);
  }
};
