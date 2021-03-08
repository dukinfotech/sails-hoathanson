module.exports = {
  tableName: 'heatmap',
  migrate: 'safe',
  async getDataM10_1(criteria, color) {
    var sql = `SELECT MAX(heatdate) as date, heattime as time, ticker as code, ${criteria} as criteria, ${color} as color
              FROM heatmap GROUP BY heatdate, ticker
              ORDER BY ${criteria} DESC`;
    var data = await sails.sendNativeQuery(sql);
    var dataRows = data.rows;

    dataRows.forEach((row) => {
      row.blue = (row.color % 65536 ) % 256;
      row.green = (row.color - row.blue) % 65536 / 256;
      row.red = (row.color- row.blue - 256 * row.green) / 65536;
    });

    return dataRows;
  },
  async getDataM10_2() {
    var latestC100 = await this.getLatestC100();
    var vn30DailyData = await this.getVN30Daily();
    var sum_vn30val = 0;
    vn30DailyData.forEach((row) => {
      row.vn30con = row.indexvol * row.freefloat * row.adjcon;
      row.vn30val = row.c * row.vn30con / 1000000;
      row.main = (row.roc1/100).toFixed(2);
      console.log(row);
      sum_vn30val += row.vn30val;
    });
    vn30DailyData.forEach((row) => {
      row.mainx = ((row.roc1/100*latestC100)*row.vn30val/(sum_vn30val)/100).toFixed(2);
    });
    vn30DailyData =  _.sortBy(vn30DailyData, ['main']);
    return this.sortHeatmap(vn30DailyData)
  },
  async getVN30Daily() {
    var sql = `SELECT trend_scoreeod.TICKER as ticker, trend_scoreeod.ROC1 as roc1, 
                trend_scoreeod.A10 as a10, trend_scoreeod.PC as pc, trend_scoreeod.LC as lc, trend_scoreeod.C as c, 
                vn30.indexvol, vn30.freefloat, vn30.adjcon, MAX(trend_scoreeod.id)
              FROM trend_scoreeod
              INNER JOIN vn30 ON trend_scoreeod.a10 = vn30.tickerid
              GROUP BY a10`;

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
  async sortHeatmap(result) {
    var tickernum = 30;
    let maxcolorval=Math.max(result[0].main,Math.abs(result[tickernum-1].main));
    let mincolorval=0;

    let UpRed		= 0;
    let UpGreen	= 255;
    let UpBlue		= 0;
    let DnRed		= 255;
    let DnGreen	= 0;
    let DnBlue		= 0;
    let DarkColor	= 20;
    let LightColor	= 180;

    for (let i = 0; i < tickernum; i++) {
      if (result[i].main>0){
        result[i].red = LightColor + 21 - ((LightColor -(((maxcolorval-result[i].main)*(LightColor-DarkColor))/(maxcolorval-mincolorval)))).toFixed(0);
        result[i].blue = 0;
        result[i].green= UpGreen;
      }
      if(result[i].main<0){ 
        result[i].green = LightColor - ((LightColor -(((maxcolorval-Math.abs(result[i].main))*(LightColor-DarkColor))/(maxcolorval-mincolorval)))).toFixed(0);
        result[i].blue = 0;
        result[i].red = DnRed;
      }
      if(result[i].main == 0){ 
        result[i].green 	= 255;
        result[i].blue = 0;
        result[i].red = 255;
      }    
    }
    return result;
  }
};
