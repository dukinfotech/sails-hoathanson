module.exports = {
  fn: async function () {
    var data = await M51.getData();
    return this.res.json({data});
  }
};
