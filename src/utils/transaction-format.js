import _ from 'lodash'

var moment = require('moment');

export function transactionAssetForm (transactions, accountId) {
    let txs = Object.values(transactions)
      .map(a => a.transactionsList)

    const  transformed = []
    txs = _.flatten(txs);

    if (!_.isEmpty(txs)){
      txs.forEach(t => {
        const { commandsList, createdTime } = t.payload.reducedPayload
    
        commandsList.forEach(c => {
          if (!c.transferAsset) return
    
          const {
            amount,
            assetId,
            destAccountId,
            srcAccountId,
            description
          } = c.transferAsset
    
          const tx = {
            from: srcAccountId === accountId ? 'you' : _.split(srcAccountId, '@', 1),
            to: destAccountId === accountId ? 'you' : _.split(destAccountId, '@', 1),
            assetId: _.split(assetId, '#', 1),
            amount: amount,
            date: moment(createdTime).format('DD-MM-YYYY HH:MM'),
            message: description
          }
    
          transformed.push(tx)
        })
      })
    }

    return _(transformed)
      .chain()
      .uniqWith(_.isEqual)
      .sortBy('date')
      .reverse()
      .value()
}

export function pendingTransactionForm (transactions) {
  const  transformed = []
    let txs = _.flatten(transactions);

    if (!_.isEmpty(txs)){
      txs.forEach(t => {
        const { commandsList, createdTime } = t.payload.reducedPayload
    

        commandsList.forEach(command => {
          // console.log(command)

          _.forEach(command, function(value, key) {
            if(!_.isUndefined(value)){
              const txs = {
                date: moment(createdTime).format('DD-MM-YYYY HH:MM'),
                label: titleCase(key.replace(/([a-z](?=[A-Z]))/g, '$1 ')),
                type: key,
                data: value
              }

              transformed.push(txs)
            }
          });
        })
      })
    }

    return _(transformed)
      .chain()
      .uniqWith(_.isEqual)
      .value()
}

function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}