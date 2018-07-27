<template>
  <div class="page" style="background-color:#f8f8f8;width:100% ; height: 100%;">
    <camera device-position="back" flash="off" binderror="error" style="width:100% ; height: 100%;"></camera>
    <button type="default" @click="camera" style="z-index:999;position:absolute;bottom:0px;">拍照</button >
    <img ref="img" :src="imagePath" style="width:100% ; height: 100%;display:none;"/>
  </div>
</template>

<script>
import baiduApi from '@/api/baidu'
export default {
  data () {
    return {
      logs: [],
      ctx: null,
      imagePath: '',
      base64Str: ''
    }
  },
  onLoad () {
    this.ctx = wx.createCameraContext()
  },
  methods: {
    camera: function () {
      var self = this
      wx.showToast({
        title: '努力识别中...',
        icon: 'loading',
        duration: 2000
      })
      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          self.imagePath = res.tempImagePath
          baiduApi.ocr(self.imagePath)
            .then(res => {
              wx.hideToast()
              if (res.statusCode === 200) {
                var data = JSON.parse(res.data)
                var words = ''
                data.words_result.forEach(n => {
                  if (n.probability && n.probability.average > 70) {
                    words += n.words
                  }
                })
                var reg = /[^\u4e00-\u9fa5]/g
                let word = words.replace(reg, '')
                wx.navigateTo({
                  url: `../lexer/main?text=${word}`
                })
              }
            })
        }
      })
    }
  }
}
</script>

