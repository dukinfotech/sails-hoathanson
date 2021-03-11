module.exports = {
  async getData() {
    var sql = `SELECT * 
              FROM
                (SELECT a10, TICKER,CVSIG,CVBAR,CV,CV5,MCDXSIG,MCDXBAR,PC,PC10,VIXSIG,VIXBAR,VIX,VIXH52W,VIXL52W,TOTALSIG, 
                  vixh52w-vix AS vixdiff FROM trend_scoreeod 
                  WHERE id IN (SELECT MAX(id) FROM trend_scoreeod GROUP BY ticker) AND DATE LIKE (SELECT MAX(DATE) FROM trend_scoreeod ) AND totalsig !="{EMPTY} " AND (LENGTH(TICKER)<4 OR ticker NOT LIKE "c%")) mt1
                LEFT JOIN (SELECT a10,STATUS FROM trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY a10)) mt2 
              ON mt1.a10=mt2.a10
              WHERE STATUS IS NOT NULL;`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}