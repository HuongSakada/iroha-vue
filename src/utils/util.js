import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers/lib/proto/endpoint_pb_service'

export const DEFAULT_TIMEOUT_LIMIT = 5000

export const cache = {
  username: localStorage.getItem('user-token')?JSON.parse(localStorage.getItem('user-token')).username : '',
  key: localStorage.getItem('user-token')?JSON.parse(localStorage.getItem('user-token')).key : '',
  nodeIp: 'http://0.0.0.0:8081'
}

export function newCommandServiceOptions (quorum) {
  return {
    privateKeys: [cache.key],
    quorum,
    creatorAccountId: cache.username,
    commandService: new CommandService(cache.nodeIp),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}

export function newQueryServiceOptions () {
  return {
    privateKey: cache.key,
    creatorAccountId: cache.username,
    queryService: new QueryService(cache.nodeIp),
    timeoutLimit: DEFAULT_TIMEOUT_LIMIT
  }
}