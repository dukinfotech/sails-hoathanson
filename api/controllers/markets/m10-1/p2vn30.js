module.exports = {
  fn: async function () {
    try {
      var dataRows = await M10.getDataM10_1('criteria1', 'color1');
      return this.res.json(dataRows);
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
