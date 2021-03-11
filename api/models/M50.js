module.exports = {
  async getData() {
    var sql = `SELECT * FROM 
                (SELECT *,ABS(tsl-c) AS gap FROM trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod WHERE DATE LIKE (SELECT MAX(DATE) FROM trend_scoreeod) GROUP BY a10) AND  (LENGTH(TICKER)<4 OR ticker NOT LIKE "c%")) mt1
              JOIN    
                  (SELECT a10,candle AS wCANDLE, cdrank AS wCDRANK, pattern AS wPATTERN, pdirection AS wPD FROM trend_scoreweekly WHERE id IN (SELECT MAX(id) FROM trend_scoreweekly WHERE DATE LIKE (SELECT MAX(DATE) FROM trend_scoreweekly) GROUP BY a10)) mt2
              ON mt1.a10=mt2.a10
              JOIN
                (SELECT a10,
                  IF(SUBSTRING(sdate, 1, 10)=DATE,STATUS,IF(STATUS="LONG","HOLDL","HOLDS")) AS _signal,
                  SUBSTRING(sdate, 1, 10) AS signaldate, ROUND(sfrom/24,0) AS daynum, ENTRY AS iENTRY, TSL AS iTSL, 
                  IF(STATUS="LONG", c-entry, 0) AS p_l,
                  IF(STATUS="LONG", 100*(c-entry)/entry, 0) AS pp_l
                    FROM trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY A10) AND DATE LIKE (SELECT MAX(DATE) FROM trend_score15ms))mt3
                  ON mt1.a10=mt3.a10 ;`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
}