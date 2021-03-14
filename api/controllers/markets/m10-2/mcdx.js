module.exports = {
  fn: async function () {
    try {
      var dataRows = await M10.getMdcxData();
      return this.res.json(dataRows);
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
