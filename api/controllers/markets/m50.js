module.exports = {
  fn: async function () {
    try {
      var data = await M50.getData();
      return this.res.json({data});
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
