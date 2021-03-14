module.exports = {
  async getSummaryData(flag, ticker, limit) {
    let vix = [];
    let rsi14 = []; 
    let atv10 = [];
    var data1 = await this.getData1(ticker, limit);
    data1 = this.convertDateToString(data1, 'DATE');

    for (let i = 0; i < limit; i++) {
      vix.push((+data1[limit-1-i].VIX/100).toFixed(2));
      rsi14.push((+data1[limit-1-i].RSI14/100).toFixed(2)); 
      atv10.push((+data1[limit-1-i].CV10/10).toFixed(2)); 
    }

    var data1_0 = data1[0];
    var indicator1 = this.indicator(data1_0);
    var indicator = [];
    indicator.push(indicator1[0]);

    var data5 = await this.getData5(ticker, limit);
    var data5_0 = data5[0];
    if (data5_0.STATUS == "LONG") {
      indicator.push({name:"LONG",sig:(+data5_0.ENTRY/100).toFixed(2),text:(+data5_0.TSL/100).toFixed(2)+" ("+((+data5_0.C-data5_0.TSL)/100).toFixed(2)+")", color:"success", value:((+data5_0.C-data5_0.ENTRY)/100).toFixed(2) } )
    } else {
      indicator.push({name:"SHORT",sig:(+data5_0.ENTRY/100).toFixed(2),text:(+data5_0.TSL/100).toFixed(2)+" ("+((+data5_0.TSL-data5_0.C)/100).toFixed(2)+")", color:"danger", value:((+data5_0.ENTRY-data5_0.C)/100).toFixed(2) } );
    }

    var data2 = await this.getData2();
    var data2_0 = data2[0];
    if (data2_0.ROC1 > 0) {
      indicator.push({name:"VNINDEX",sig:"up",text:(+data2_0.C/100).toFixed(2),color:"success",value:(+data2_0.ROC1/100).toFixed(2)})
    } else {
      indicator.push({name:"VNINDEX",sig:"down",text:(+data2_0.C/100).toFixed(2), color:"danger", value:(+data2_0.ROC1/100).toFixe(2)})
    }

    var data3 = await this.getData3();
    var data3_0 = data3[0];
    if (data3_0.STATUS == "LONG") {
      indicator.push({name:"VN30 - LONG",sig:(+data3_0.ENTRY/100).toFixed(2),text:(+data3_0.TSL/100).toFixed(2)+" ("+((+data3_0.C-data3_0.TSL)/100).toFixed(2)+")", color:"success", value:((+data3_0.C-data3_0.ENTRY)/100).toFixed(2) } );
    } else {
      indicator.push({name:"VN30 - SHORT",sig:(+data3_0.ENTRY/100).toFixed(2),text:(+data3_0.TSL/100).toFixed(2)+" ("+((+data3_0.TSL-data3_0.C)/100).toFixed(2)+")", color:"danger", value:((+data3_0.ENTRY-data3_0.C)/100).toFixed(2) } );
    }
        
    indicator.push(indicator1[2]);
    indicator.push(indicator1[3]);

    var data4 = await this.getData4(ticker, limit);
    data4 = this.convertDateToString(data4, 'DATE');
    var data4_0 = data4[0];
    if (data4_0.CDRANK > 0) {
      indicator.push({name:"W Candlestick",sig:"up",text:"Up trend", color:"success", value:data4_0.CANDLE });
    } else {
      if (data4_0.CDRANK < 0) {
        indicator.push({name:"W Candlestick",sig:"down",text:"Down trend", color:"danger", value:data4_0.CANDLE });
      } else {
        indicator.push({name:"W Candlestick",sig:"left-right",text:"No trend", color:"warning", value:"Nan" });
      }
    }  
        
    for (let i = 4; i <indicator1.length; i++) {
      indicator.push(indicator1[i]);
    }

    let iR=0;
    let iG=0;
    let iY=0;
             
    for (let i = 0; i <indicator.length ; i++) {
      if (indicator[i].color=="success") {
        iG = iG + 1;
      } else {
        if (indicator[i].color=="danger") {
          iR = iR + 1;
        } else {
          iY = iY + 1;
        }
      }  
    }

    var option1 = this.MCDX(limit, data1);
    var woption2 = this.priceOHLC(limit , data4 , 1);
    var option2 = this.priceOHLC(limit, data1, 1);
    var ioption2 = this.priceOHLC(limit, data5, 0);

    var cafeFURL = await this.getCafeFURL(ticker);
    var data0 = await this.getData0(ticker);
    var data6 = await this.getData6(ticker);
    var data8 = await this.getData8();
    var data9 = await this.getData9();
    var data10 = await this.getData10(ticker);
    date10 = this.convertDateToString(data10, 'DATE');

    var summaryall = {
      title: ticker,
      flag: flag,
      fa: data0[0],
      all: data1_0,
      data1: option1,
      data2: option2,
      wdata2: woption2,
      idata2: ioption2,
      data6: vix,
      data7:rsi14,
      data8:atv10,
      data3:iG,
      data4:iR,
      data5:iY, 
      indicator:indicator,
      farange: data6[0],
      cafeFURL,
      sptday: data5_0.SFROM,
      lsp: data8[0],
      lspx: data9[0],
      SPT: data10,
      vn30sptday: data3_0.SFROM
    };

    return summaryall;
  },
  async getData0(ticker) {
    var sql0 = `SELECT *
                FROM
                  (SELECT tickerid, EPS, BookValuePerShare, SalesPerShare, ReturnOnEquity, ReturnOnAssets, BETA
                  FROM fainfo WHERE ticker LIKE $1 LIMIT 1) mt1
                LEFT JOIN (SELECT id, FULLNAME FROM ticker WHERE ticker LIKE $1 ) mt2
                ON mt2.id=mt1.tickerid LIMIT 0, 1000`;
    var data0 = await sails.sendNativeQuery(sql0, [ticker]);
    var dataRows = data0.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData1(ticker, limit) {
    var sql1 = `SELECT *
                FROM trend_scoreeod
                WHERE id IN
                  (SELECT MAX(id)
                  FROM trend_scoreeod
                  WHERE ticker LIKE $1
                  GROUP BY DATE)
                ORDER BY id DESC LIMIT ${limit}`;
    var data1 = await sails.sendNativeQuery(sql1, [ticker]);
    var dataRows = data1.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData2() {
    var sql2 = `SELECT ROC1,C
                FROM trend_scoreeod
                WHERE ticker LIKE 'vnindex'
                ORDER BY id DESC LIMIT 1`;
    var data2 = await sails.sendNativeQuery(sql2);
    var dataRows = data2.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData3() {
    var sql3 = `SELECT C,STATUS,ENTRY,TSL,SFROM
                FROM trend_score15ms
                WHERE ticker LIKE 'vn30'
                ORDER BY id DESC LIMIT 1`;
    var data3 = await sails.sendNativeQuery(sql3);
    var dataRows = data3.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData4(ticker, limit) {
    var sql4 = `SELECT CANDLE,CDRANK,DATE,ARESISTANCE, ASUPPORT,BBANDTOP,BBANDBOT,MA10,MA20,MA100, O,H,L,C,V
                FROM trend_scoreweekly
                WHERE id IN
                  (SELECT MAX(id)
                  FROM trend_scoreweekly
                  WHERE ticker LIKE $1
                  GROUP BY DATE)
                ORDER BY id DESC LIMIT ${limit}`;
    var data4 = await sails.sendNativeQuery(sql4, [ticker]);
    var dataRows = data4.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData5(ticker, limit) {
    var sql5 = `SELECT TIME,DATE,ARESISTANCE, ASUPPORT,BBANDTOP,BBANDBOT,MA10,MA20,MA100, O,H,L,C,V, STATUS,ENTRY,TSL,SFROM
                FROM trend_score15ms
                WHERE id IN
                  (SELECT MAX(id)
                  FROM trend_score15ms
                  WHERE ticker LIKE $1
                  GROUP BY A1)
                ORDER BY id DESC LIMIT ${limit}`;
    var data5 = await sails.sendNativeQuery(sql5, [ticker]);
    var dataRows = data5.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData6(ticker) {
    var sql6 = `SELECT MIN(mt1.c/mt2.EPS) AS mpe, AVG(mt1.c/mt2.EPS) AS ape, MAX(mt1.c/mt2.EPS) AS Mpe, MIN(mt1.c/mt2.BookValuePerShare) AS mpbv, AVG(mt1.c/mt2.BookValuePerShare) AS apbv, MAX(mt1.c/mt2.BookValuePerShare) AS Mpbv, MIN(mt1.c/mt2.SalesPerShare) AS mps, AVG(mt1.c/mt2.SalesPerShare) AS aps, MAX(mt1.c/mt2.SalesPerShare) AS Mps, MIN(mt2.ReturnOnEquity) AS mroe, AVG(mt2.ReturnOnEquity) AS aroe, MAX(mt2.ReturnOnEquity) AS Mroe, MIN(mt2.ReturnOnAssets) AS mroa, AVG(mt2.ReturnOnAssets) AS aroa, MAX(mt2.ReturnOnAssets) AS Mroa,  MIN(mt2.EPS) AS meps, AVG(mt2.EPS) AS aeps, MAX(mt2.EPS) AS Meps, MIN(mt2.BETA) AS mbeta, AVG(mt2.BETA) AS abeta, MAX(mt2.BETA) AS Mbeta
              FROM 
              (SELECT TICKER,c,a10
              FROM  trend_scoreeod
              WHERE id IN
                (SELECT MAX(id)
                FROM trend_scoreeod 
                WHERE ROUND(c,1) > (SELECT c FROM trend_scoreeod WHERE ticker LIKE $1 ORDER BY id DESC LIMIT 1)*0.9
                AND ROUND(c,1) < (SELECT c FROM trend_scoreeod WHERE ticker LIKE $1 ORDER BY id DESC LIMIT 1)*1.1 GROUP BY a10)) mt1
              LEFT JOIN 
                (SELECT tickerid, EPS, BookValuePerShare, SalesPerShare, ReturnOnEquity, ReturnOnAssets, BETA FROM fainfo) mt2
                ON mt1.a10=mt2.tickerid LIMIT 0, 1000`;
    var data6 = await sails.sendNativeQuery(sql6, [ticker]);
    var dataRows = data6.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData7(ticker) {
    var sql7 = `SELECT TICKER,SAN,M FROM cafef WHERE ticker LIKE $1 LIMIT 0, 1000`;
    var data7 = await sails.sendNativeQuery(sql7, [ticker]);
    var dataRows = data7.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData8() {
    var sql8 = `SELECT mt1.date, mt1.count AS L, mt2.count AS S 
                FROM
                  (SELECT * FROM drafr
                  WHERE id IN 
                    (SELECT MAX(id) FROM drafr WHERE STATUS LIKE "LONG" GROUP BY DATE )
                    ORDER BY id DESC LIMIT 1) mt1
                  LEFT JOIN
                    (SELECT * FROM drafr WHERE id IN 
                      (SELECT MAX(id) FROM drafr WHERE STATUS LIKE "SHORT" GROUP BY DATE )
                    ORDER BY id DESC LIMIT 1) mt2
                  ON mt1.date=mt2.date LIMIT 0, 1000`;
    var data8 = await sails.sendNativeQuery(sql8);
    var dataRows = data8.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData9() {
    var sql9 = `WITH abc AS 
                  (SELECT mt2.date,mt1.*,mt2.c,mt2.v FROM
                    (SELECT TICKER,a10, c,v,DATE FROM trend_scoreeod WHERE id IN 
                      (SELECT MAX(id) FROM trend_scoreeod GROUP BY ticker) AND DATE LIKE (SELECT MAX(DATE) FROM trend_scoreeod ) AND LENGTH(TICKER)<4) mt2
                  LEFT JOIN (SELECT TICKER,a10, STATUS AS xstatus FROM  trend_score15ms 
                    WHERE id IN (SELECT MAX(id) FROM trend_score15ms GROUP BY ticker)) mt1
                  ON mt1.a10=mt2.a10)
                SELECT COUNT(IF(xstatus = 'LONG', 1, NULL)) AS L,COUNT(IF(xstatus = 'SHORT', 1, NULL)) AS S FROM abc`;
    var data9 = await sails.sendNativeQuery(sql9);
    var dataRows = data9.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  async getData10(ticker) {
    var sql10 = `SELECT TICKER, DATE, _SHOW, STATUS, ENTRY 
              FROM trend_score15ms WHERE _SHOW=1 AND ticker LIKE $1 ORDER BY id DESC LIMIT 0, 1000
              `;
    var data10 = await sails.sendNativeQuery(sql10, [ticker]);
    var dataRows = data10.rows;
    if (dataRows.length == 0) throw 404;
    return dataRows;
  },
  indicator(rawdata) {
    let indicator = [];
    if (+rawdata.ROC1 > 0) {
      indicator.push({name:"ROC",sig:"up",text:"Up trend", color:"success", value:(+rawdata.ROC1/100).toFixed(2)+"%" });
    } else {
      indicator.push({name:"ROC",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.ROC1/100).toFixed(2)+"%" });
    }

    if (rawdata.STATUS == "LONG") {
      indicator.push({name:"SPT",sig:"up",text:"Up trend", color:"success", value:"L@"+(+rawdata.ENTRY/100).toFixed(2) });
    } else {
      indicator.push({name:"SPT",sig:"down",text:"Down trend", color:"danger", value:"S@"+(+rawdata.ENTRY/100).toFixed(2) });
    }

    if (+rawdata.CDRANK > 0) {
      indicator.push({name:"Candlestick",sig:"up",text:"Up trend", color:"success", value:rawdata.CANDLE });
    } else {
      if (+rawdata.CDRANK < 0) {
        indicator.push({name:"Candlestick",sig:"down",text:"Down trend", color:"danger", value:rawdata.CANDLE });
      } else {
        indicator.push({name:"Candlestick",sig:"left-right",text:"No trend", color:"warning", value:"Nan" });
      }
    }

    if (+rawdata.PDIRECTION > 0) {
      indicator.push({name:"Triangle Pattern",sig:"up",text:"Up trend", color:"success", value:rawdata.PATTERN });
    } else {
      if (+rawdata.PDIRECTION < 0) {
        indicator.push({name:"Triangle Pattern",sig:"down",text:"Down trend", color:"danger", value:rawdata.PATTERN });
      } else {
        indicator.push({name:"Triangle Pattern",sig:"left-right",text:"No trend", color:"warning", value:"Nan" });
      }
    } 
   
    if (+rawdata.ADX14/100 > 25) {
      if (+rawdata.PDI14< +rawdata.MDI14) {
        indicator.push({name:"ADX",sig:"up",text:"Up trend", color:"success", value:(+rawdata.ADX14/100).toFixed(2) });
      } else {
        indicator.push({name:"ADX",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.ADX14/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"ADX",sig:"left-right",text:"No trend", color:"warning", value:(+rawdata.ADX14/100).toFixed(2) });
    }
    
    if (+rawdata.MACD > +rawdata.MACDS) {
      indicator.push({name:"MACD",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MACD/100).toFixed(2) });
    } else {
      indicator.push({name:"MACD",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MACD/100).toFixed(2) });
    }
  
    if (+rawdata.MA10 < +rawdata.C) {
      indicator.push({name:"MA10",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MA10/100).toFixed(2) });
    } else {
      indicator.push({name:"MA10",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MA10/100).toFixed(2) });
    }

    if (+rawdata.MA100 < +rawdata.C) {
      indicator.push({name:"MA100",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MA100/100).toFixed(2) });
    } else {
      indicator.push({name:"MA100",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MA100/100).toFixed(2) });
    }
  
    if (+rawdata.PSAR < +rawdata.C) {
      indicator.push({name:"PSAR",sig:"up",text:"Up trend", color:"success", value:(+rawdata.PSAR/100).toFixed(2) });
    } else {
      indicator.push({name:"PSAR",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.PSAR/100).toFixed(2) });
    }
    
    if (+rawdata.MFI14/100 < 80)  {
      if (+rawdata.MFI14/100 < 20) {
        indicator.push({name:"MFI",sig:"up",text:"Oversold", color:"success", value:(+rawdata.MFI14/100).toFixed(2) });
      } else {
        indicator.push({name:"MFI",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.MFI14/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"MFI",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.MFI14/100).toFixed(2) });
    }
  
    if (+rawdata.RSI14/100 < 70) {
      if (+rawdata.RSI14/100 < 30) {
        indicator.push({name:"RSI",sig:"up",text:"Oversold", color:"success", value:(+rawdata.RSI14/100).toFixed(2) });
      } else {
        indicator.push({name:"RSI",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.RSI14/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"RSI",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.RSI14/100).toFixed(2) });
    }
    
    if (+rawdata.STOCHKV/100 < 70) {
      if (+rawdata.STOCHKV/100 < 30) {
        indicator.push({name:"STOCHK",sig:"up",text:"Oversold", color:"success", value:(+rawdata.STOCHKV/100).toFixed(2) });
      } else {
        indicator.push({name:"STOCHK",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.STOCHKV/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"STOCHK",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.STOCHKV/100).toFixed(2) });
    }

    if (+rawdata.STOCHDV/100 < 70) {
      if (+rawdata.STOCHDV/100 < 30) {
        indicator.push({name:"STOCHD",sig:"up",text:"Oversold", color:"success", value:(+rawdata.STOCHDV/100).toFixed(2) });
      } else {
        indicator.push({name:"STOCHD",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.STOCHDV/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"STOCHD",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.STOCHDV/100).toFixed(2) });
    }
    
    if (+rawdata.ADX7/100 > 25)  {
      if (+rawdata.PDI7 < +rawdata.MDI7) {
        indicator.push({name:"ADX7",sig:"up",text:"Up trend", color:"success", value:(+rawdata.ADX7/100).toFixed(2) });
      } else {
        indicator.push({name:"ADX7",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.ADX7/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"ADX7",sig:"left-right",text:"No trend", color:"warning", value:(+rawdata.ADX14/100).toFixed(2) });
    }

    if (+rawdata.CCI7/100 > -100) {
      if (+rawdata.CCI7/100 > 100) {
        indicator.push({name:"CCI7",sig:"up",text:"Up trend", color:"success", value:(+rawdata.CCI7/100).toFixed(2) });
      } else {
        indicator.push({name:"CCI7",sig:"left-right",text:"No trend", color:"warning", value:(+rawdata.CCI7/100).toFixed(2) })
      }
    } else {
      indicator.push({name:"CCI7",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.CCI7/100).toFixed(2) });
    }

    if (+rawdata.CCI14/100 > -100) {
      if (+rawdata.CCI14/100 > 100) {
        indicator.push({name:"CCI",sig:"up",text:"Up trend", color:"success", value:(+rawdata.CCI14/100).toFixed(2) })
      } else {
        indicator.push({name:"CCI",sig:"left-right",text:"No trend", color:"warning", value:(+rawdata.CCI14/100).toFixed(2) })
      }
    } else {
      indicator.push({name:"CCI",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.CCI14/100).toFixed(2) });
    }

    if (+rawdata.MA20 < +rawdata.C) {
      indicator.push({name:"MA20",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MA20/100).toFixed(2) });
    } else {
      indicator.push({name:"MA20",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MA20/100).toFixed(2) });
    }
  
    if (+rawdata.MA50 < +rawdata.C) {
      indicator.push({name:"MA50",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MA50/100).toFixed(2) });
    } else {
      indicator.push({name:"MA50",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MA50/100).toFixed(2) });
    }
  
    if (+rawdata.MA200 < +rawdata.C) {
      indicator.push({name:"MA200",sig:"up",text:"Up trend", color:"success", value:(+rawdata.MA200/100).toFixed(2) });
    } else {
      indicator.push({name:"MA200",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.MA200/100).toFixed(2) });
    }

    if (+rawdata.DPO < 0) {
      indicator.push({name:"DPO",sig:"up",text:"Up trend", color:"success", value:(+rawdata.DPO/100).toFixed(2) });
    } else {
      indicator.push({name:"DPO",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.DPO/100).toFixed(2) });
    }

    if (+rawdata.TRIX > 0) {
      indicator.push({name:"TRIX",sig:"up",text:"Up trend", color:"success", value:(+rawdata.TRIX/100).toFixed(2) });
    } else {
      indicator.push({name:"TRIX",sig:"down",text:"Down trend", color:"danger", value:(+rawdata.TRIX/100).toFixed(2) });
    }
    
    if (+rawdata.MFI7/100 < 80) {
      if (+rawdata.MFI7/100 < 20) {
        indicator.push({name:"MFI7",sig:"up",text:"Oversold", color:"success", value:(+rawdata.MFI7/100).toFixed(2) });
      } else {
        indicator.push({name:"MFI7",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.MFI7/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"MFI7",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.MFI7/100).toFixed(2) });
    }

    if (+rawdata.RSI7/100 < 70) {
      if (+rawdata.RSI7/100 < 30) {
        indicator.push({name:"RSI7",sig:"up",text:"Oversold", color:"success", value:(+rawdata.RSI7/100).toFixed(2) });
      } else {
        indicator.push({name:"RSI7",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.RSI7/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"RSI7",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.RSI7/100).toFixed(2) });
    }

    if (+rawdata.WILL7/100 < -20) {
      if (+rawdata.WILL7/100 < -80) {
        indicator.push({name:"WILLIAMS %R7",sig:"up",text:"Oversold", color:"success", value:(+rawdata.WILL7/100).toFixed(2) });
      } else {
        indicator.push({name:"WILLIAMS %R7",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.WILL7/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"WILLIAMS %R7",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.WILL7/100).toFixed(2) });
    }

    if (+rawdata.WILL14/100 < -20) {
      if (+rawdata.WILL14/100<-80) {
        indicator.push({name:"WILLIAMS %R",sig:"up",text:"Oversold", color:"success", value:(+rawdata.WILL14/100).toFixed(2) });
      } else {
        indicator.push({name:"WILLIAMS %R",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.WILL14/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"WILLIAMS %R",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.WILL14/100).toFixed(2) });
    }
  
    if (+rawdata.ULTIMATE/100 < 70) {
      if (+rawdata.ULTIMATE/100 < 30) {
        indicator.push({name:"ULTIMATE",sig:"up",text:"Oversold", color:"success", value:(+rawdata.ULTIMATE/100).toFixed(2) });
      } else {
        indicator.push({name:"ULTIMATE",sig:"left-right",text:"Nan", color:"warning", value:(+rawdata.ULTIMATE/100).toFixed(2) });
      }
    } else {
      indicator.push({name:"ULTIMATE",sig:"down",text:"Overbought", color:"danger", value:(+rawdata.ULTIMATE/100).toFixed(2) });
    }
  
    return indicator;
  },
  MCDX(limit, rawdata) {
    let date = [];
    let pc = [];
    let lc = [];
    let fc = [];
    for (let i = 0; i < limit; i++) {
      date.push(rawdata[limit-1-i].DATE);
      pc.push((+rawdata[limit-1-i].PC/100).toFixed(2));
      lc.push((+rawdata[limit-1-i].LC/100).toFixed(2));
      fc.push((+rawdata[limit-1-i].FC/100).toFixed(2));  
    };
    
    let upColor = '#00da3c';
    let downColor = '#ec0000';
    
    option = {
      tooltip: {},
      grid: {
        left: '3%',
        right: '2%',
        top: '4%',
        height: '89%'
      },
      xAxis: {
        data: date,
      },
      yAxis: {
        min: 0,
        max:100,
      },
      series: [
        {
        name: 'Red(PC)',
        type: 'bar',
        stack: 'one',
        color: downColor,
        data: pc,
        }, {
        name: 'Yellow(FC)',
        type: 'bar',
        stack: 'one',
        color: 'yellow',
        data: fc,
        }, {
        name: 'Green(LC)',
        type: 'bar',
        stack: 'one',
        color: upColor,
        data: lc,
        }]
    };  
    return option;
  },
  priceOHLC(limit, rawdata, flag) {
    if (rawdata[0].ARESISTANCE == 0) {
      vARESISTANCE = "{EMPTY}";
    } else {
      vARESISTANCE = (+rawdata[0].ARESISTANCE/100).toFixed(2);
    };

    if (rawdata[0].ASUPPORT == 0) {
      vASUPPORT = "{EMPTY}";
    } else {
      vASUPPORT= (+rawdata[0].ASUPPORT/100).toFixed(2);
    };
    
    let date = [];
    let v = [];
    let bbtop = [];
    let bbbot = [];
    let ma20 = [];
    let ma50 = [];
    let ma200 = [];
    let ohlc = [];
    if (rawdata.length >= limit) {
      if (flag == 1) {
        for (let i = 0; i < limit; i++) {
          date.push(rawdata[limit-1-i].DATE);
        }
      } else {
        for (let i = 0; i < limit; i++) {
          date.push(rawdata[limit-1-i].TIME);
        }
      }
      for (let i = 0; i < limit; i++) {
        v.push([i+1,+(rawdata[limit-1-i].V*100), +rawdata[limit-1-i].C > +rawdata[limit-1-i].O ? 1 : -1 ]);
        bbtop.push((+rawdata[limit-1-i].BBANDTOP/100).toFixed(2));
        bbbot.push((+rawdata[limit-1-i].BBANDBOT/100).toFixed(2));
        ma20.push((+rawdata[limit-1-i].MA10/100).toFixed(2));
        ma50.push((+rawdata[limit-1-i].MA20/100).toFixed(2));
        ma200.push((+rawdata[limit-1-i].MA100/100).toFixed(2));
        ohlc.push([(+rawdata[limit-1-i].O/100).toFixed(2),(+rawdata[limit-1-i].C/100).toFixed(2),(+rawdata[limit-1-i].L/100).toFixed(2),(+rawdata[limit-1-i].H/100).toFixed(2)]); 
      }
    } else {
      if (flag==1) {
        for (let i = 0; i < limit-rawdata.length; i++) {
          date.push("");
        }
        for (let i = limit-rawdata.length; i < limit; i++) {
          date.push(rawdata[limit-1-i].DATE);
        }
      } else {
        for (let i = 0; i < limit-rawdata.length; i++) {
          date.push(null);
        }
        for (let i = limit-rawdata.length; i < limit; i++) {
          date.push(rawdata[limit-1-i].TIME);
        }
      }
      for (let i = 0; i < limit-rawdata.length; i++) {
        v.push(null);
        bbtop.push(null);
        bbbot.push(null);
        ma20.push(null);
        ma50.push("");
        ma200.push("");
        ohlc.push(["","","",""]); 
      } 
      for (let i = limit-rawdata.length; i < limit; i++) {
        v.push([i+1,+(rawdata[limit-1-i].V*100), +rawdata[limit-1-i].C > +rawdata[limit-1-i].O ? 1 : -1 ]);
        bbtop.push((+rawdata[limit-1-i].BBANDTOP/100).toFixed(2));
        bbbot.push((+rawdata[limit-1-i].BBANDBOT/100).toFixed(2));
        ma20.push((+rawdata[limit-1-i].MA10/100).toFixed(2));
        ma50.push("");
        ma200.push("");
        ohlc.push([(+rawdata[limit-1-i].O/100).toFixed(2),(+rawdata[limit-1-i].C/100).toFixed(2),(+rawdata[limit-1-i].L/100).toFixed(2),(+rawdata[limit-1-i].H/100).toFixed(2)]); 
      }
    }
    date.unshift("");
    bbtop.unshift(null);
    bbbot.unshift(null);
    ma20.unshift(null);
    ma50.unshift(null);
    ma200.unshift(null);
    v.unshift([0,0,1]);
    ohlc.unshift([]);
    date.push("");
    bbtop.push(null);
    bbbot.push(null);
    ma20.push(null);
    ma50.push(null);
    ma200.push(null);
    v.push([limit+1,0,1]);
    ohlc.push([]);

    let upColor = '#00da3c';
    let downColor = '#ec0000';
  
    option = {
      grid: [
        { top: '6%',
          left: '3%',
          right: '2%',
          height: '60%'
        },
        { top: '80%',
          left: '3%',
          right: '2%',
          height: '18%'
        }
      ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
        },
      backgroundColor: 'rgba(245, 245, 245, 0.8)',
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000'
        },
      position:"right",
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: {xAxisIndex: 'all'},
      label: {
        backgroundColor: '#777'
        }
    },
    visualMap: {
      show: false,
      seriesIndex: 6,
      dimension: 2,
      pieces: [{
        value: 1,
        color: upColor
        }, {
        value: -1,
        color: downColor
        }]
    },
    xAxis: [
      {
        type: 'category',
        data: date,
        scale: true,
        boundaryGap: false,
        axisLine: {onZero: false},
        splitLine: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
        axisPointer: {
          z: 100
          }
      },{
        type: 'category',
        gridIndex: 1,
        data: date,
        scale: true,
        boundaryGap: false,
        axisLine: {onZero: false},
        axisTick: {show: false},
        splitLine: {show: false},
        axisLabel: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax',
      }
      ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true
          }
      },{
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: {show: false},
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {show: false}
      }
      ],
    series: [{
      name: 'OHLC',
      type: 'k',
      data: ohlc,
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: upColor,
        borderColor0: downColor
        },
      markLine: {
        symbol: ['none', 'pin'],
        data: [{
          yAxis: vARESISTANCE,
          lineStyle: {color:"#ec4561"},
          label: {show: false},
          emphasis: {label: {show: false}}
          }, {
          yAxis: vASUPPORT,
          lineStyle: {color:"#38a4f8"},
          label: {show: false},
          emphasis: {label: {show: false  }}
          }]
        }    
      }, {
        name: 'MA20',
        type: 'line',
        data: ma20,
        color:"#f8b425",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      }, {
        name: 'MA50',
        type: 'line',
        data: ma50,
        color:"#626ed4",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
        }
      }, {
        name: 'MA200',
        type: 'line',
        data: ma200,
        color:"#02a499",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 1
          }
      }, {
        name: 'BBB',
        color:'#6c757d',
        type: 'line',
        stack: '1',
        areaStyle: {
          color:"transparent",
        },
        data: bbbot,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      }, {
        name: 'BBT',
        color:'#6c757d',
        type: 'line',
        stack: '2',
        areaStyle: {
          color:"transparent",
        },
        data: bbtop,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          opacity: 0.5
        }
      }, {
        name: 'Volume',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        barMaxWidth: 6,
        data: v,
        }
      ]
    };
    return option;
  },
  UnicodeToKoDau(n) {
    let str = n;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    return str;
  },
  UnicodeToKoDauAndGach(n) {
    let str = this.UnicodeToKoDau(n);
    str = str.replace(/ /g,"-");
    str = str.trim(); 
    return str;
  }, 
  async getCafeFURL(ticker) {
    var cafeFURL;
    if (ticker.length == 3) {
      var data7 = await this.getData7(ticker);
      var _ticker = data7[0].ticker;
      var sDomain = 'https://s.cafef.vn';
      if(_ticker == "VNINDEX") {
        cafeFURL = sDomain.trimEnd("/")+"/Lich-su-giao-dich-Symbol-VNINDEX/Trang-1-0-tab-1.chn";
      }
      if(_ticker == "HNX-INDEX") {
        cafeFURL = sDomain.trimEnd("/")+"/Lich-su-giao-dich-Symbol-HNX-INDEX/Trang-1-0-tab-1.chn";
      }
      if(_ticker == "UPCOM-INDEX") {
        cafeFURL = sDomain.trimEnd("/")+"/Lich-su-giao-dich-Symbol-UPCOM-INDEX/Trang-1-0-tab-1.chn";
      }
      var r = "hose";
      data7[0].SAN=="2"&&(r="hastc");
      data7[0].SAN=="8"&&(r="otc");
      data7[0].SAM=="9"&&(r="upcom");
      var t = data7[0].M;
      t.lastIndexOf("(")>0&&(t=t.substring(0,t.lastIndexOf("(")));
      t = this.UnicodeToKoDauAndGach(t);

      cafeFURL = sDomain.trimEnd("/")+"/"+r+"/"+_ticker+"-"+t+".chn";
    } else {
      cafeFURL = '#';
    }
    return cafeFURL;
  },
  convertDateToString(dataRows = [], col) {
    dataRows.forEach((row) => {
      let date = new Date(row[col]);
      let dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      row[col] = dateString;
    });
    return dataRows;
  }
}