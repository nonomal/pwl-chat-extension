<template>
  <el-tooltip v-if="via" placement="right" :hide-after="0">
    <template #content>
      <div class="tooltip-content" @click="handleClick">{{ via.content + ' ' + version }}</div>
    </template>
    <div><icon-svg class="via" :icon-class="via.icon" /></div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'via-component',
  props: {
    client: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      via: undefined,
      version: '',
      vias: new Map([
        [
          'Windows',
          {
            icon: 'windows',
            content: '来自桌面客户端',
            url: 'https://github.com/imlinhanchao/fishpi-desktop/releases'
          }
        ],
        [
          'macOS',
          {
            icon: 'mac',
            content: '来自桌面客户端',
            url: 'https://github.com/imlinhanchao/fishpi-desktop/releases'
          }
        ],
        [
          'Linux',
          {
            icon: 'linux',
            content: '来自桌面客户端',
            url: 'https://github.com/imlinhanchao/fishpi-desktop/releases'
          }
        ],
        [
          'Chrome',
          {
            icon: 'chrome',
            content: '来自 Chrome 扩展',
            url: 'https://chrome.google.com/webstore/detail/fkaomdjjdbglkbcmfhhlioejkpacbbpe'
          }
        ],
        [
          'Edge',
          {
            icon: 'edge',
            content: '来自 Edge 扩展',
            url: 'https://microsoftedge.microsoft.com/addons/detail/oldbilakhdpiamjbkocdcdnlnakainfm'
          }
        ],
        [
          'VSCode',
          {
            icon: 'vscode',
            content: '来自 VsCode 扩展',
            url: 'https://marketplace.visualstudio.com/items?itemName=hancel.pwl-chat'
          }
        ],
        [
          'IDEA',
          {
            icon: 'jetbrains',
            content: '来自 IDEA 扩展',
            url: 'https://plugins.jetbrains.com/plugin/18091-pwl-chat'
          }
        ],
        [
          'Python',
          {
            icon: 'python',
            content: '来自 Python 客户端',
            url: `${process.env.VUE_APP_BASE_URL}/article/1641135630423`
          }
        ],
        [
          'Golang',
          {
            icon: 'golang',
            content: '来自 Golang 客户端',
            url: `${process.env.VUE_APP_BASE_URL}/article/1641661864119`
          }
        ],
        [
          'Web',
          {
            icon: 'web',
            content: '来自 Web',
            url: `${process.env.VUE_APP_BASE_URL}/cr`
          }
        ],
        [
          'iOS',
          {
            icon: 'ios',
            content: '来自 iPhone 客户端',
            url: 'https://apps.apple.com/cn/app/%E6%91%B8%E9%B1%BC%E6%B4%BE/id1617385824'
          }
        ],
        [
          'Android',
          {
            icon: 'android',
            content: '来自 Android 客户端',
            url: `${process.env.VUE_APP_BASE_URL}/article/1641291342622`
          }
        ],
        [
          'Mobile',
          {
            icon: 'mobile',
            content: '来自移动端'
          }
        ],
        [
          'Extension',
          {
            icon: 'extension',
            content: '来自扩展程序'
          }
        ],
        [
          'PC',
          {
            icon: 'pc',
            content: '来自桌面客户端'
          }
        ],
        [
          'Other',
          {
            icon: 'others',
            content: '来自其他客户端'
          }
        ]
      ])
    }
  },
  created() {
    if (!this.client) {
      return
    }
    const client = this.client.split('/')
    if (client.length > 1) {
      this.version = client[1]
    }
    this.via = this.vias.get(client[0]) ?? { icon: 'others', content: client[0] }
  },
  methods: {
    handleClick() {
      this.via.url && window.open(this.via.url)
    }
  }
}
</script>

<style scoped>
.via {
  font-size: 12px;
  margin-left: 6px;
}
.tooltip-content {
  max-width: 200px;
}
</style>
