module.exports = {
  async getData() {
    var sql = `SELECT mt1.date, mt1.count AS L, mt2.count AS S 
              FROM 
                (SELECT * FROM drafr WHERE id IN (SELECT MAX(id) FROM drafr WHERE STATUS LIKE "LONG" GROUP BY DATE )   ORDER BY id DESC ) mt1
              LEFT JOIN 
                (SELECT * FROM drafr WHERE id IN (SELECT MAX(id) FROM drafr WHERE STATUS LIKE "SHORT" GROUP BY DATE )   ORDER BY id DESC ) mt2
              ON mt1.date=mt2.date`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}