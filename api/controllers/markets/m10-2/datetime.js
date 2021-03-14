module.exports = {
  fn: async function () {
    try {
      var datetime = await M10.getDateTime(true);
      return this.res.json(datetime); 
    } catch (error) {
      console.log(error);
      return this.res.serverError();
    }
  }
};
