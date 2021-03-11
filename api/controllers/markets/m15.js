module.exports = {
  fn: async function () {
    var data = await M15.getData();
    return this.res.json({data});
  }
};
