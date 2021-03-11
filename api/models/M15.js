module.exports = {
  tableName: 'heatmap',
  migrate: 'safe',
  async getData() {
    var sql = `SELECT mt1.*,mt2.cv,mt2.cv5,mt2.roc1,mt2.timex,ABS(mt1.tsl-mt2.c) AS gap, mt2.C,mt2.TOTALSIG
              FROM 
                (SELECT ticker,a10,
                  IF(SUBSTRING(sdate, 1, 10)=DATE,STATUS,IF(STATUS="LONG","HOLDL","HOLDS")) AS _signal,
                  SUBSTRING(sdate, 1, 10) AS signaldate, ROUND(sfrom/24,0) AS daynum,ENTRY, TSL, 
                  IF(STATUS="LONG", c-entry, 0) AS p_l,
                  IF(STATUS="LONG", 100*(c-entry)/entry, 0) AS pp_l
                  FROM trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY A10) AND DATE LIKE (SELECT MAX(DATE) FROM trend_score15ms) AND (LENGTH(TICKER)<4 OR ticker NOT LIKE "c%"))mt1
              LEFT JOIN 
                (SELECT ticker,a10,cv,cv5,roc1,timex,C,TOTALSIG FROM trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod  GROUP BY a10)) mt2 
              ON mt1.a10=mt2.a10`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}