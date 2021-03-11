module.exports = {
  async getData() {
    var sql = `SELECT mt1.date, 
                  mt1.ATV5p AS L5, mt2.ATV5p AS S5,
                  mt1.ATV1p AS L1, mt2.ATV1p AS S1, 
                  mt1.Xpc + mt2.Xpc AS PC5, 
                  mt1.Xlc + mt2.Xlc AS LC5, 
                  100-(mt1.Xpc + mt2.Xpc + mt1.Xlc + mt2.Xlc) AS FC5, 
                  mt1.Xvix + mt2.Xvix AS VIX5,
                  mt1.EATV5p AS LE, mt2.EATV5p AS SE
                FROM
                  (SELECT * FROM drafx WHERE id IN (SELECT MAX(id) FROM drafx WHERE STATUS LIKE "LONG" GROUP BY DATE )   ORDER BY id DESC ) mt1
                LEFT JOIN 
                  (SELECT * FROM drafx WHERE id IN (SELECT MAX(id) FROM drafx WHERE STATUS LIKE "SHORT" GROUP BY DATE )   ORDER BY id DESC ) mt2
                ON mt1.date=mt2.date`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}