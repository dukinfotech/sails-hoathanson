module.exports = {
  fn: async function () {
    // Get data of latest date
    var sql = `SELECT MAX(date) as date, time, code, criteria1, color1
              FROM index_heatmap GROUP BY date, code
              ORDER BY criteria1 DESC`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;

    dataRows.forEach((row) => {
      row.blue = (row.color1 % 65536 ) % 256;
      row.green = (row.color1 - row.blue) % 65536 / 256;
      row.red = (row.color1- row.blue - 256 * row.green) / 65536;
    });

    return this.res.json(dataRows);
  }
};

