module.exports = {
  fn: async function () {
    var dataRows = await M10.getChangeOrP2VN30Data(true);
    return this.res.json(dataRows);
  }
};
