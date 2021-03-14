module.exports = {
  fn: async function () {
    try {
      var data = await M51.getData();
      return this.res.json({data});
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
