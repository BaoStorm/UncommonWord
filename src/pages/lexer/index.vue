<template>
  <div class="page" style="background-color:#f8f8f8">
    <div class="weui-cells weui-cells_after-title" >
      <div class="weui-cell" v-for="(item,index) in lexers" :key="index">
        <div class="weui-cell__bd">
            <div style="font-size: 13px;color: #888888;">{{item.pinyin}}</div>
            <div>{{item.text}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import baiduApi from '@/api/baidu'
export default {
  data () {
    return {
      word: '',
      lexers: [],
      isLoading: true
    }
  },
  mounted () {
    this.word = this.$root.$mp.query.text
    this.lexers = []
    this.identify(this)
  },
  methods: {
    identify: (self) => {
      wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 2000
      })
      baiduApi.getLexer(self.word)
        .then((res) => {
          self.lexers = null
          self.lexers = res.data
          // self.$emit('lexers', res.data)
          wx.hideToast()
        })
    }
  }
}
</script>
