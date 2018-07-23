<template>
  <div class="page" style="background-color:#f8f8f8">
    
  </div>
</template>
<script>
import baiduApi from '@/api/baidu'
export default {
  data () {
    return {
      word: '',
      lexers: []
    }
  },
  mounted () {
    this.word = this.$root.$mp.query.text
    this.identify(this.word)
  },
  methods: {
    identify: (word) => {
      baiduApi.getLexer(word)
        .then((res) => {
          this.lexers = res.data
          console.log(this.lexers)
        })
    }
  }
}
</script>
