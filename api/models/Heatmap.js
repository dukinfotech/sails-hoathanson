module.exports = {
  tableName: 'index_heatmap',
  migrate: 'safe',
  attributes: {
    date: { type: 'string' },
    time: { type: 'string' },
    code: { type: 'string' },
    criteria1: { type: 'string' },
    color1: { type: 'string' },
    criteria2: { type: 'string' },
    color2: { type: 'string' },
    criteria3: { type: 'string' },
    color3: { type: 'string' },
    criteria4: { type: 'string' },
    color4: { type: 'string' },
    bartime: { type: 'number' },
  },
  async getData(criteria, color) {
    var sql = `SELECT MAX(date) as date, time, code, ${criteria} as criteria, ${color} as color
    FROM index_heatmap GROUP BY date, code
    ORDER BY ${criteria} DESC`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;

    dataRows.forEach((row) => {
      row.blue = (row.color % 65536 ) % 256;
      row.green = (row.color - row.blue) % 65536 / 256;
      row.red = (row.color- row.blue - 256 * row.green) / 65536;
    });

    return dataRows;
  }
};
