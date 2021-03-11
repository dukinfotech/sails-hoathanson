module.exports = {
  fn: async function () {
    var data = await M30.getData();
    return this.res.json({data});
  }
};
