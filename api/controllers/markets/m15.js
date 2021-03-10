module.exports = {
  fn: async function () {
    
    var draw = this.req.query.draw;
    var start = this.req.query.start;
    var length = this.req.query.length;
    var minAtv5 = this.req.query.minAtv5;
    var maxAtv5 = this.req.query.maxAtv5;
    var sortBy = this.req.query.order ? this.req.query.order[0]['column'] : null;
    var sortDir = this.req.query.order ? this.req.query.order[0]['dir'] : null;

    var recordsFiltered;
    var data = await M15.getData(start, length, minAtv5, maxAtv5, sortBy, sortDir);
    var recordsTotal = await M15.getRecordsTotal();
    if (isNaN(minAtv5) && isNaN(maxAtv5)) {
      recordsFiltered = recordsTotal;
    } else {
      recordsFiltered = await M15.getRecordsFiltered(minAtv5, maxAtv5);
    }
    var transformedData = {
      draw: draw,
      recordsTotal: recordsTotal,
      recordsFiltered: recordsFiltered,
      data: data
    }
    return this.res.json(transformedData);
  }
};
