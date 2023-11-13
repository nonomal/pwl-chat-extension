import { createStore } from 'vuex'
import { user } from './module/user'
import { getUserInfo, getKey } from '../api/login'
import { STORAGE, MESSAGE_TYPE } from '../constant/Constant'
import { setLocal, getLocal } from '../utils/chromeUtil'
import { isRedPacket } from '../utils/util'

export default createStore({
  modules: {
    user
  },
  state: {
    message: [],
    discuss: '',
    online: {
      onlineChatCnt: 0,
      users: []
    }
  },
  getters: {
    message: (state) => {
      return state.message
    },
    messageLength: (state) => {
      return state.message.length
    },
    lastMessageId: (state) => {
      const length = state.message.length
      return length > 0 ? state.message[length - 1].oId : 0
    },
    online: (state) => {
      return state.online
    },
    discuss: (state) => {
      return state.discuss
    }
  },
  mutations: {
    popMessage(state) {
      state.message.pop()
    },
    addMessage(state, message) {
      if (!message.isMsg) {
        state.message.unshift(message.message)
        return
      }
      if (isRedPacket(message.message)) {
        state.message.unshift(message.message)
        return
      }
      // +1 消息折叠
      const last = state.message[0]
      if (!last || message.message.md !== last.md) {
        state.message.unshift(message.message)
        return
      }
      const { users = [], oIds = [] } = last
      users.push({
        userName: message.message.userName,
        userAvatarURL: message.message.userAvatarURL
      })
      oIds.push(message.oId)
      state.message[0].users = users
      state.message[0].oIds = oIds
    },
    concatMessage(state, data) {
      const index = state.message.length - 1
      const last = state.message[index]
      const message = data[0]
      // +1 消息折叠
      if (!last || last.content !== message.content) {
        state.message = state.message.concat(data)
        return
      }
      const { users = [], oIds = [] } = message
      users.push({
        userName: last.userName,
        userAvatarURL: last.userAvatarURL
      })
      oIds.push(last.oId)
      if (last.users) {
        message.users = users.concat(last.users)
        message.oIds = oIds.concat(last.oIds)
      } else {
        message.users = users
        message.oIds = oIds
      }
      state.message[index] = message
      state.message = state.message.concat(data.slice(1))
    },
    logout(state) {
      state.message = []
      state.userInfo = {}
    },
    setOnline(state, online) {
      state.online = {
        onlineChatCnt: online.onlineChatCnt,
        users: online.users
      }
      state.discuss = online.discussing
    },
    setDiscuss(state, discuss) {
      state.discuss = discuss
    },
    updateRedPacket(state, message) {
      let msg
      state.message.some((e) => {
        if (e.oId === message.oId && e.type !== MESSAGE_TYPE.redPacketStatus) {
          msg = JSON.parse(e.content)
          if (msg.got >= msg.count) {
            return true
          }
          msg.got = message.got ? message.got : msg.count
          e.content = JSON.stringify(msg)
          return true
        }
        return false
      })
    },
    revoke(state, oId) {
      state.message.some((e) => {
        if (
          e.type === MESSAGE_TYPE.msg &&
          (e.oId === oId || (e.oIds && e.oIds.some((e) => e === oId)))
        ) {
          e.revoke = true
          return true
        }
        return false
      })
    }
  },
  actions: {
    getUser(context) {
      return new Promise((resolve, reject) => {
        getLocal([STORAGE.key, STORAGE.account], async (result) => {
          if (!result || !result[STORAGE.key]) {
            reject(new Error('未登录'))
            return
          }
          let key = result[STORAGE.key]
          let res = await getUserInfo({ apiKey: key })
          if (res.code !== 0) {
            const r = await getKey(result[STORAGE.account])
            if (r.code !== 0) {
              setLocal({ [STORAGE.key]: '' })
              reject(new Error('获取key请求失败'))
              return
            }
            key = r.Key
            setLocal({ [STORAGE.key]: key })
            res = await getUserInfo({ apiKey: key })
            if (r.code !== 0) {
              reject(new Error('获取用户信息失败'))
              return
            }
          }
          context.commit('setUserInfo', res.data)
          context.commit('setKey', key)
          resolve()
        })
      })
    }
  }
})
