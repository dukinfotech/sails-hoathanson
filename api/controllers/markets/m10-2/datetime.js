module.exports = {
  fn: async function () {
    var datetime = await M10.getDateTime(true);
    return this.res.json(datetime);
  }
};
