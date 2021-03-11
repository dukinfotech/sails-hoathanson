module.exports = {
  fn: async function () {
    var data = await M31.getData();
    return this.res.json({data});
  }
};
