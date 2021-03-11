module.exports = {
  fn: async function () {
    var data = await M50.getData();
    return this.res.json({data});
  }
};
