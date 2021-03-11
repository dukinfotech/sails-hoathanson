module.exports = {
  fn: async function () {
    var data = await M20.getData();
    return this.res.json({data});
  }
};
