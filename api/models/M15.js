module.exports = {
  tableName: 'heatmap',
  migrate: 'safe',
  columns: ['ticker', '_signal', 'cv5', 'daynum', 'ENTRY', 'C', 'roc1',
    'cv', 'TSL', 'gap', 'pp_l', 'signaldate', 'TOTALSIG'],
  async getData(start, length, minAtv5, maxAtv5, sortBy, sortDir) {
    var condition = await this.filterConditionString(minAtv5, maxAtv5, 'cv5');
    var sort = await this.sortByString(sortBy, sortDir);
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
              ON mt1.a10=mt2.a10
              ${condition}
              ${sort}
              LIMIT ${length} OFFSET ${start}`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
  async getRecordsTotal() {
    var sql = `SELECT COUNT(*) as total
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
    return dataRows[0].total;
  },
  async getRecordsFiltered(min, max) {
    var condition = await this.filterConditionString(min, max, 'cv5');
    var sql = `SELECT COUNT(*) as total
                FROM 
                  (SELECT ticker,a10,
                    IF(SUBSTRING(sdate, 1, 10)=DATE,STATUS,IF(STATUS="LONG","HOLDL","HOLDS")) AS _signal,
                    SUBSTRING(sdate, 1, 10) AS signaldate, ROUND(sfrom/24,0) AS daynum,ENTRY, TSL, 
                    IF(STATUS="LONG", c-entry, 0) AS p_l,
                    IF(STATUS="LONG", 100*(c-entry)/entry, 0) AS pp_l
                    FROM trend_score15ms WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY A10) AND DATE LIKE (SELECT MAX(DATE) FROM trend_score15ms) AND (LENGTH(TICKER)<4 OR ticker NOT LIKE "c%"))mt1
                LEFT JOIN 
                  (SELECT ticker,a10,cv,cv5,roc1,timex,C,TOTALSIG FROM trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod  GROUP BY a10)) mt2 
                ON mt1.a10=mt2.a10
                ${condition}`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows[0].total;
  },
  async filterConditionString(min, max, col) {
    var condition;
    if (min && max) {
      condition = `WHERE ${col} >= ${min} AND ${col} <= ${max}`;
    }
    if (min && !max) {
      condition = `WHERE ${col} >= ${min}`;
    }
    if (!min && max) {
      condition = `WHERE ${col} <= ${max}`;
    }
    if (!min && !max) {
      condition = '';
    }
    return condition;
  },
  async sortByString(sortBy, sortDir) {
    var sort = '';
    if (sortBy && sortDir) {
      sort = `ORDER BY ${this.columns[sortBy]} ${sortDir}`;
    }
    return sort;
  }
}