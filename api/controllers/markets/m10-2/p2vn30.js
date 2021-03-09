module.exports = {
  fn: async function () {
    var dataRows = await M10.getChangeOrP2VN30Data(false);
    return this.res.json(dataRows);
  }
};
