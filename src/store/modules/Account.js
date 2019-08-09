/* eslint-disable */
import Vue from 'vue'
import _ from 'lodash'
import commands from 'iroha-helpers/lib/commands'
import queries from 'iroha-helpers/lib/queries'
import { cryptoHelper, signWithArrayOfKeys, sendTransactions } from 'iroha-helpers'
import { cache,newCommandService, newCommandServiceOptions, newQueryServiceOptions} from '../../utils/util'
import { transactionAssetForm, pendingTransactionForm, getTransferAssetsFrom } from '../../utils/transaction-format'

//Saving keypaires
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const types = _([
  'GET_ACCOUNT',
  'GET_ACCOUNT_ASSETS',
  'GET_ACCOUNT_ASSET_TRANSACTIONS',
  'GET_SIGNATORIES',
  'SET_ACCOUNT_QUORUM',
  'GET_PENDING_TRANSACTIONS'
]).chain()
  .flatMap(x => [x + '_SUCCESS', x + '_FAILURE'])
  .map(x => [x, x])
  .fromPairs()
  .value()

function initialState () {
  return {
    accountId: cache.username,
    accountInfo: {
      name: '',
      phone: '',
      email: ''
    },
    rawAssetTransactions: {},
    rawPendingTransactions: [],
    assets: [],
    accountQuorum: 0,
    roles: [],
    permissions: [],
    signatories: []
  }
}

function handleError (state, error) {
  throw error
}

const state = initialState()

const getters = {
  transfers (state) {
    let transactions = _.cloneDeep(state.rawAssetTransactions)
    let txs = Object.values(transactions)
      .map(a => a.transactionsList)

    return transactionAssetForm(txs, state.accountId)
  },

  getPendingTransactions (state) {
    let pendingTransactionsCopy = _.cloneDeep(state.rawPendingTransactions)
    
    return !Array.isArray(pendingTransactionsCopy) ? pendingTransactionForm(
      pendingTransactionsCopy.toObject().transactionsList
    ) : []
  },

  getTransactionByAssetId: (state) => (assetId) => {
    let transactions = _.cloneDeep(state.rawAssetTransactions)

    return transactionAssetForm(transactions[assetId].transactionsList, state.accountId)
  },

  allAssets (state) {
    return state.assets
  },

  assets (state) {
    const assets = state.assets.map(a => {
      const assetParts = a.assetId.split('#')
      const assetName = assetParts[0].toLowerCase()

      return {
        id: a.assetId.replace(/#/g, '$'),
        assetId: a.assetId,
        name: _.upperFirst(assetName),
        domain: assetParts[1].toLowerCase(),
        amount: a.balance,
        precision: a.balance.precision
      }
    })

    return assets.filter(Boolean)
  },

  getUserRoles (state) {
    return state.roles
  },

  getSignatories (state) {
    return state.signatories
  }
}

const mutations = {
  [types.GET_ACCOUNT_ASSETS_SUCCESS] (state, assets) { 
    state.assets = assets 
  },
  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, error) {
    handleError(state, error)
  },

  [types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS] (state, { assetId, transactions }) {
    Vue.set(state.rawAssetTransactions, assetId, transactions)
  },
  [types.GET_ACCOUNT_ASSETS_FAILURE] (state, error) {
    handleError(state, error)
  },

  [types.GET_ACCOUNT_SUCCESS] (state, account) {
    
    let { jsonData, accountId, quorum } = account.getAccount().toObject()
    
    state.accountQuorum = quorum
    state.accountId = accountId
    state.roles = account.array[1]

    if(!_.isEmpty(JSON.parse(jsonData))) {
      state.accountInfo = JSON.parse(jsonData)[accountId]
    }
  },
  [types.GET_ACCOUNT_FAILURE] (state, error) {
    handleError(state, error)
  },

  [types.GET_SIGNATORIES_SUCCESS] (state, signatories) {
    state.signatories = signatories
  },
  [types.GET_SIGNATORIES_FAILURE] (state, error) {
    handleError(state, error)
  },

  [types.SET_ACCOUNT_QUORUM_SUCCESS] (state, quorum) {
    state.accountQuorum = quorum
  },
  [types.SET_ACCOUNT_QUORUM_FAILURE] (state, error) {
    handleError(state, error)
  },

  [types.GET_PENDING_TRANSACTIONS_SUCCESS] (state, pendingTransactions) {
    state.rawPendingTransactions = pendingTransactions
  },
  [types.GET_PENDING_TRANSACTIONS_FAILURE] (state, error) {
    handleError(state, error)
  },
}

const actions = {
  signPendingTransaction ({ commit, state }, txStoreId ) {
    let transaction = state.rawPendingTransactions.getTransactionsList()[txStoreId]
    let txToSend = _.cloneDeep(transaction)
    txToSend.clearSignaturesList()

    txToSend = signWithArrayOfKeys(txToSend, [cache.key])

    return sendTransactions(
      [txToSend], 
      newCommandService(), 
      500, 
      [
        'COMMITTED'
      ]
    )
    .catch(err => {
      throw err
    })
  },

  addSignatory ({ dispatch, state}, publicKey) {
    return commands.addSignatory(
      newCommandServiceOptions(state.accountQuorum), 
      {
      accountId: state.accountId,
      publicKey: publicKey
    })
    .then(() => {
      dispatch('setAccountQuorum', state.accountQuorum + 1)
    })
    .catch(err => {
      throw err
    })
  },

  removeSignatory ({dispatch, state}, publicKey) {
    return commands.removeSignatory(
      newCommandServiceOptions(state.accountQuorum), 
      {
      accountId: state.accountId,
      publicKey: publicKey
    })
    .then(() => {
      dispatch('setAccountQuorum', state.accountQuorum - 1)
    })
    .catch(err => {
      throw err
    })
  },

  setAccountQuorum ({commit, state}, quorum) {
    return commands.setAccountQuorum(
      newCommandServiceOptions(state.accountQuorum),
      {
        accountId: state.accountId,
        quorum: quorum
      }
    )
    .then(() => {
      commit(types.SET_ACCOUNT_QUORUM_SUCCESS, quorum)
    })
    .catch(err => {
      commit(types.SET_ACCOUNT_QUORUM_FAILURE, err)
    })
  },

  logout () {
    //Clear state value
    const s = initialState()
    Object.keys(s).forEach(key => {
      state[key] = s[key]
    })

    cache.username = null
    cache.key = null

    localStorage.clear()
  },

  login ({ commit }, { username, privateKey }) {
    cache.key = privateKey
    cache.username = username
    
    return queries.getRawAccount(
      newQueryServiceOptions(),
      {
      accountId: cache.username
    })
    .then((account) => {
      localStorage.setItem('user-token', JSON.stringify(cache))

      commit(types.GET_ACCOUNT_SUCCESS, account)
    })
    .catch(err => {
      localStorage.removeItem('user-token')
      commit(types.GET_ACCOUNT_FAILURE, err)
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

  createAccount ({ state }, { accountName, domainId }) {

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
          var zip = new JSZip()
          var accountId = `${accountName}@${domainId}`

          zip.file(`${accountId}.priv`, privateKey)
          zip.file(`${accountId}.pub`, publicKey)

          zip.generateAsync({type:"blob"})
          .then(function(content) {
              saveAs(content, `${accountName}_key_pairs.zip`)

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

  appendRole ({state}, { accountId, roleName}) {
    return commands.appendRole(
      newCommandServiceOptions(state.accountQuorum), 
      {
        accountId: accountId,
        roleName: roleName
      })
      .catch(err => {
        throw err
      })
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
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_SUCCESS, {
          assetId: assetId,
          transactions: responses
        })
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSET_TRANSACTIONS_FAILURE, err)
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
        commit(types.GET_ACCOUNT_ASSETS_SUCCESS, assets)
      })
      .catch(err => {
        commit(types.GET_ACCOUNT_ASSETS_FAILURE, err)
    })
  },

  getAccountDetail ({ dispatch, commit, state }) {
    return queries.getRawAccount(
      newQueryServiceOptions(),
      {
      accountId: state.accountId
    })
    .then((account) => {
      commit(types.GET_ACCOUNT_SUCCESS, account)
    })
    // .then(() => {
    //   const rolePermissions = state.roles.map(role => {
    //     return dispatch('getRolePermissions', role)
    //   })

    //   return Promise.all(rolePermissions)
    // })
    .catch(err => {
      commit(types.GET_ACCOUNT_FAILURE, err)
    })
  },

  getRolePermissions ({ commit, state }, roleId) {
    return queries.getRolePermissions(
      newQueryServiceOptions(),
      {
      roleId: roleId
    })
    .then((permission) => {
      state.permissions = _.uniq(_.concat(state.permissions, permission))
    })
    .catch(err => {
      throw err
    })
  },

  getSignatories ({ commit, state }) {
    return queries.getSignatories(
      newQueryServiceOptions(),
      {
        accountId: state.accountId
      })
      .then((signatories) => {
        commit(types.GET_SIGNATORIES_SUCCESS, signatories)
      })
      .catch((err) => {
        commit(types.GET_SIGNATORIES_FAILURE, err)
    })
  },

  getRawPendingTransactions ({ commit, state }) {
    return queries.getRawPendingTransactions(
      newQueryServiceOptions())
      .then((pendingTransactions) => {
        commit(types.GET_PENDING_TRANSACTIONS_SUCCESS, pendingTransactions)
      })
      .catch((err) => {
        commit(types.GET_PENDING_TRANSACTIONS_FAILURE, err)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}