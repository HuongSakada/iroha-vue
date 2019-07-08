/* eslint-disable */
import Vue from 'vue'
import _ from 'lodash'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import { cryptoHelper } from 'iroha-helpers'
import { cache, newCommandServiceOptions, newQueryServiceOptions} from '../../utils/util'

//Saving keypaires
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

var moment = require('moment');

function initialState () {
  return {
    accountId: cache.username,
    accountInfo: {
      name: '',
      phone: '',
      email: ''
    },
    rawAssetTransactions: {},
    rawTransactions: [],
    assets: [],
    accountQuorum: 0
  }
}

const state = initialState()

const getters = {
  transfers (state) {
    let txs = Object.values(state.rawAssetTransactions)
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
            from: srcAccountId === state.accountId ? 'you' : _.split(srcAccountId, '@', 1),
            to: destAccountId === state.accountId ? 'you' : _.split(destAccountId, '@', 1),
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
  },

  allAssets (state) {
    return state.assets
  }
}

const mutations = {
  getAccountAssets (state, assets) { state.assets = assets },
  getAccountAssetTransactions (state, { assetId, transactions }) {Vue.set(state.rawAssetTransactions, assetId, transactions)},
  getAccountQuorum (state, { quorum }) { state.accountQuorum = quorum },
  getAccount (state, { jsonData, accountId, quorum }) { 
    state.accountQuorum = quorum
    state.accountId = accountId

    if(!_.isEmpty(JSON.parse(jsonData))){
      state.accountInfo = JSON.parse(jsonData)[accountId]
    }
  },
}

const actions = {
  logout () {
    cache.username = null
    cache.key = null

    localStorage.clear()
  },

  login ({ commit }, { username, privateKey }) {
    cache.key = privateKey
    cache.username = username
    
    return queries.getAccount(
      newQueryServiceOptions(),
      {
      accountId: cache.username
    })
    .then((account) => {
      localStorage.setItem('user-token', JSON.stringify(cache))

      commit('getAccount', account)
    })
    .catch(err => {
      localStorage.removeItem('user-token')
      throw err
    })
  },

  setAccountDetails ({state}) {
    const setAccountDetailArray = _.flatMap(state.accountInfo, function(value, key) {
      return commands.setAccountDetail(
        newCommandServiceOptions(state.accountQuorum), 
        {
        accountId: state.accountId,
        key: key,
        value: value
      })
      .catch(err => {
        throw err
      })
    });

    return Promise.all(setAccountDetailArray)
  },

  setAccountDetail ({state}, { key, value }) {
    return commands.setAccountDetail(
      newCommandServiceOptions(state.accountQuorum), 
      {
      accountId: state.accountId,
      key: key,
      value: value
    })
    .catch(err => {
      throw err
    })
  },

  createAccount ({ state }, {accountName, domainId}) {

    let { publicKey, privateKey } = cryptoHelper.generateKeyPair()

    if(!_.isEmpty(accountName.trim()) || _.isEmpty(domainId.trim())){
      return new Promise((resolve, reject) => {
        return commands.createAccount(
          newCommandServiceOptions(state.accountQuorum),
          {
            accountName: accountName,
            domainId: domainId,
            publicKey: publicKey
          }
        )
        .then(() => {
          var zip = new JSZip();
          zip.file(`${accountName}@${domainId}.priv`, privateKey);
          zip.file(`${accountName}@${domainId}.pub`, publicKey);

          zip.generateAsync({type:"blob"})
          .then(function(content) {
              saveAs(content, `${accountName}_key_pairs.zip`);

              resolve()
          });
        })
        .catch(err => { reject(err) })
      })
      .catch(err => {
        throw err
      })
    }
  },

  addAssetQuantity ({state}, { assetId, amount }) {
    return commands.addAssetQuantity(
      newCommandServiceOptions(state.accountQuorum), 
      {
        assetId,
        amount
      })
      .catch(err => {
        throw err
      })
  },

  createAsset ({ state }, {assetName, domainId, precision}) {
    return commands.createAsset(
      newCommandServiceOptions(state.accountQuorum),
      {
        assetName: assetName,
        domainId: domainId,
        precision: precision
      }
    )
    .catch(err => { throw err })
  },

  transferAsset ({state}, { assetId, to, description = '', amount }) {
    return commands.transferAsset(
      newCommandServiceOptions(state.accountQuorum), 
      {
        srcAccountId: state.accountId,
        destAccountId: to,
        assetId,
        description,
        amount
      })
      .catch(err => {
        throw err
      })
  },

  getAccountAssetTransactions ({ commit, state }, { assetId }) {
    return queries.getAccountAssetTransactions(
      newQueryServiceOptions(),
      {
        accountId: state.accountId,
        assetId,
        pageSize: 100,
        firstTxHash: undefined
      })
      .then(responses => {
        commit('getAccountAssetTransactions', {
          assetId: assetId,
          transactions: responses
        })
      })
      .catch(err => {
        throw err
      })
  },

  getAllAccountAssetsTransactions ({ dispatch, state }) {

    let gettingAccountAssets

    if (_.isEmpty(state.assets)) {
      gettingAccountAssets = dispatch('getAccountAssets')
    } else {
      gettingAccountAssets = Promise.resolve()
    }

    return gettingAccountAssets
      .then(() => {
        const gettingAllAccountAssetsTransactions = state.assets.map(a => {
          return dispatch('getAccountAssetTransactions', { assetId: a.assetId })
        })

        return Promise.all(gettingAllAccountAssetsTransactions)
      })
      .catch(err => {
        throw err
      })
  },

  getAccountAssets ({ commit, state }) {
    return queries.getAccountAssets(
      newQueryServiceOptions(),
      {
        accountId: state.accountId
      })
      .then(assets => {
        commit('getAccountAssets', assets)
      })
      .catch(err => {
        throw err
    })
  },

  getAccountDetail ({ commit, state }) {
    return queries.getAccount(
      newQueryServiceOptions(),
      {
      accountId: state.accountId
    })
    .then((account) => commit('getAccount', account))
    .catch(err => {
      throw err
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
