<template>
  <div class="page" style="background-color:#f8f8f8;width:100% ; height: 100%;">
    <camera device-position="back" flash="off" binderror="error" style="width:100% ; height: 100%;"></camera>
    <button type="default" @click="camera" style="z-index:999;position:absolute;bottom:0px;">拍照</button >
    <img ref="img" :src="imagePath" style="width:100% ; height: 100%;display:none;"/>
  </div>
</template>

<script>
import api from '@/api'
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
    console.log(this.ctx)
  },
  methods: {
    camera: function () {
      console.log(this.ctx)
      this.ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log(res)
          this.imagePath = res.tempImagePath
          api.uploadFile(this.imagePath)
            .then(res => {
              console.log(res)
            })
        }
      })
    }
  }
}
</script>

