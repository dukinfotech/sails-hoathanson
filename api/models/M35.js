module.exports = {
  async getData() {
    var sql = `WITH abc AS(
                SELECT mt2.date,mt1.*,mt2.c,mt2.v FROM
                  (SELECT TICKER,a10, c,v,DATE FROM  trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod GROUP BY ticker) AND DATE LIKE (SELECT MAX(DATE) FROM trend_scoreeod )  AND LENGTH(TICKER)<4) mt2
                LEFT JOIN 
                  (SELECT TICKER,a10, STATUS AS xstatus FROM  trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY ticker) ) mt1
                ON  mt1.a10=mt2.a10)
              SELECT *, c*v/(SELECT SUM(c*v) FROM abc WHERE xstatus IS NOT NULL) AS percentage FROM abc  WHERE xstatus IS NOT NULL`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}