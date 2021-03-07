module.exports = {
  tableName: 'index_heatmap',
  migrate: 'safe',
  attributes: {
    date: { type: 'string' },
    time: { type: 'string' },
    code: { type: 'string' },
    criteria1: { type: 'string' },
    color1: { type: 'string' },
    criteria2: { type: 'string' },
    color2: { type: 'string' },
    criteria3: { type: 'string' },
    color3: { type: 'string' },
    criteria4: { type: 'string' },
    color4: { type: 'string' },
    bartime: { type: 'number' },
  }
};
