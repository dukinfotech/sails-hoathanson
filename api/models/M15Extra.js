module.exports = {
  async getData(listId) {
    var list = await this.getList(listId);
    var sql = `SELECT mt1.*,mt2.cv,mt2.cv5,mt2.roc1,mt2.timex,ABS(mt1.tsl-mt2.c) AS gap, mt2.C,mt2.TOTALSIG FROM 
                (SELECT ticker,a10,
                  IF(SUBSTRING(sdate, 1, 10)=DATE,STATUS,IF(STATUS="LONG","HOLDL","HOLDS")) AS _signal,
                  SUBSTRING(sdate, 1, 10) AS signaldate, ROUND(sfrom/24,0) AS daynum,ENTRY, TSL, 
                  IF(STATUS="LONG", c-entry, 0) AS p_l,
                  IF(STATUS="LONG", 100*(c-entry)/entry, 0) AS pp_l
                FROM trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY A10) AND DATE LIKE (SELECT MAX(DATE) FROM trend_score15ms) AND  ticker IN ${list}) mt1
              LEFT JOIN 
                (SELECT ticker,a10,cv,cv5,roc1,timex,C,TOTALSIG FROM trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod  GROUP BY a10)) mt2 
              ON mt1.a10=mt2.a10;`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
  async getList(listId) {
    var sql = ` SELECT list FROM m15_list WHERE id= $1`;
    var data = await sails.sendNativeQuery(sql, [listId]);
    var dataRows = data.rows
    var list = dataRows[0].list;
    var formatedList = list.substring(0, list.length-2)+')';
    return formatedList;
  }
}