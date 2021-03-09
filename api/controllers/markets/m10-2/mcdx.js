module.exports = {
  fn: async function () {
    var dataRows = await M10.getMdcxData();
    return this.res.json(dataRows);
  }
};
