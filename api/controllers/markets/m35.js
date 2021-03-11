module.exports = {
  fn: async function () {
    var data = await M35.getData();
    return this.res.json({data});
  }
};
