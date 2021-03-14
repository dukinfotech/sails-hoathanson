module.exports = {
  fn: async function () {
    try {
      var dataRows = await M10.getChangeOrP2VN30Data(false);
      return this.res.json(dataRows);
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
