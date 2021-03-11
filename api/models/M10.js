module.exports = {
  async getDataM10_1(criteria, color) {
    var sql = `SELECT heatdate AS date, heattime AS time, ticker AS code, ${criteria} AS criteria, ${color} AS color
                FROM heatmap WHERE id IN (SELECT MAX(id) FROM heatmap WHERE heatdate LIKE ( SELECT MAX(heatdate) FROM heatmap) GROUP BY ticker)
                ORDER BY ${criteria} DESC;`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;

    dataRows.forEach((row) => {
      row.blue = (row.color % 65536 ) % 256;
      row.green = (row.color - row.blue) % 65536 / 256;
      row.red = (row.color- row.blue - 256 * row.green) / 65536;
    });

    return dataRows;
  },
  async getMdcxData() {
    var vn30DailyData = await this.getVN30Daily();
    vn30DailyData.forEach((row) => {
      row.mainx = Math.round(100 * (row.pc/100)) / 100;
      row.mainx2 = Math.round(100 * (row.lc/100)) / 100;
      row.main = row.pc > 0 ? - Math.round(100 * row.pc) / 100 : Math.round(100 * row.lc) / 100;
    });
    vn30DailyData =  _.sortByOrder(vn30DailyData, ['main'], ['desc']);
    return this.attachColor(vn30DailyData, true);
  },
  async getChangeOrP2VN30Data(isCompareWithMain) {
    var latestC100 = await this.getLatestC100();
    var vn30DailyData = await this.getVN30Daily();
    var sum_vn30val = 0;
    vn30DailyData.forEach((row) => {
      row.vn30con = row.indexvol * row.freefloat * row.adjcon;
      row.vn30val = row.c * row.vn30con / 1000000;
      row.main = Math.round(100 * (row.roc1/100))/100;
      sum_vn30val += row.vn30val;
    });
    vn30DailyData.forEach((row) => {
      row.mainx = Math.round(100 * ((row.roc1/100*latestC100)*row.vn30val/(sum_vn30val)/100)) / 100;
    });
    vn30DailyData =  isCompareWithMain ? 
                    _.sortByOrder(vn30DailyData, ['main'], ['desc']) : 
                    _.sortByOrder(vn30DailyData, ['mainx'], ['desc'])
    return this.attachColor(vn30DailyData, isCompareWithMain);
  },
  async getVN30Daily() {
    var sql = `SELECT mt1.date as date, mt1.timex as timex,mt1.TICKER AS ticker, mt1.ROC1 AS roc1, 
                mt1.A10 AS a10, mt1.PC AS pc, mt1.LC AS lc, mt1.C AS c, 
                vn30.indexvol, vn30.freefloat, vn30.adjcon, MAX(mt1.id)
              FROM (SELECT * FROM trend_scoreeod WHERE id IN (SELECT MAX(id) FROM trend_scoreeod GROUP BY a10) AND a10 IN (SELECT tickerid FROM vn30)) mt1
              INNER JOIN vn30 ON mt1.a10 = vn30.tickerid
              GROUP BY a10;`;

    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows;
  },
  async getLatestC100() {
    var sql = `SELECT c/100 as c100
              FROM trend_scoreeod 
              WHERE ticker="vn30" 
              ORDER BY id DESC LIMIT 1`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows[0] ? dataRows[0].c100 : 0;
  },
  async attachColor(dataRows, isCompareWithMain) {
    const tickerTotal = dataRows.length;
    const maxColorVal = Math.max(dataRows[0].main, Math.abs(dataRows[tickerTotal-1].main));
    const minColorVal = 0;
    const upGreenVal = 255;
    const downRedVal = 255;
    const darkColor	= 20;
    const lightColor = 180;
    
    dataRows.forEach(row => {
      var compareVal = isCompareWithMain ? row.main : row.mainx;
      if (compareVal > 0) {
        row.red = lightColor + 21 - (lightColor-(((maxColorVal-compareVal)*(lightColor-darkColor))/(maxColorVal-minColorVal)));
        row.blue = 0;
        row.green= upGreenVal;
      } else if (compareVal < 0) {
        row.green = lightColor - (lightColor-(((maxColorVal-Math.abs(compareVal))*(lightColor-darkColor))/(maxColorVal-minColorVal)));
        row.blue = 0;
        row.red = downRedVal;
      } else {
        row.green 	= 255;
        row.blue = 0;
        row.red = 255;
      }    
    });
    return dataRows;
  },
  async getDateTime() {
    var sql = `SELECT DATE as date, timex as timex FROM  trend_scoreeod WHERE DATE LIKE (SELECT MAX(DATE) FROM trend_scoreeod) ORDER BY id DESC LIMIT 1;`;

    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;
    return dataRows[0];
  },
};
