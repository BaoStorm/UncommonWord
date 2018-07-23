<template>
  <div class="page" style="background-color:#f8f8f8">
    <div class="weui-cells__title">待识别文本</div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <textarea class="weui-textarea" placeholder="请输入文本" rows="3" v-model="word"></textarea>
          <div class="weui-textarea-counter">
            <span>{{wordUseCount}}</span>/{{maxWordCount}}
          </div>
        </div>
      </div>
    </div>
    <div style="padding:10rpx;">
      <button type="primary" @click="identify">识别</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      word: '',
      maxWordCount: 200,
      wordUseCount: 0,
      checkboxItems: [
        { name: 'standard is dealt for u.', value: '0', checked: true },
        { name: 'standard is dealicient for u.', value: '1', checked: false }
      ]
    }
  },
  watch: {
    word (value, oldValue) {
      if (value.length > this.maxWordCount) {
        this.word = oldValue
      }
      this.wordUseCount = this.word.length
    }
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    identify () {
      if (this.word.length === 0) {
        wx.showToast({
          title: '请输入识别文本',
          icon: 'none',
          duration: 2000
        })
        return
      }
      var reg = /[^\u4e00-\u9fa5]/g
      let word = this.word.replace(reg, '')
      wx.navigateTo({
        url: `../lexer/main?text=${word}`
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
    this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
