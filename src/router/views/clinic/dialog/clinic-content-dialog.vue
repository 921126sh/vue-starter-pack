<template>
  <v-dialog v-model="isOpen" max-width="600px" height="800px">
    <v-carousel height="auto" width="100%" align-center show-arrows-on-hover>
      <v-carousel-item
        v-for="(data, i) in datas"
        :key="i"
        v-dompurify-html="data.clinicContentImg"
      >
        <!-- {{ cc(data) }} -->
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script>
import { getAllClinicContent } from '@api/clinic.api'
import createDOMPurifyfrom from 'dompurify'

export default {
  data() {
    return {
      // 다이얼로그 여부
      isOpen: false,

      // 데이터 목록
      datas: [],
    }
  },
  created() {
    this.EventBus.$on('contentL_TO_contentD-1', (param) => {
      getAllClinicContent(param.datas.clinicId).then(
        (response) => {
          this.datas = response
          this.isOpen = true
        },
        (error) => {
          this.$notify({
            group: 'notifyApp',
            title: '에러!!',
            type: 'error',
            text: error,
          })
        }
      )
    })
  },
  methods: {
    cc(data) {
      console.log('createDOMPurifyfrom :', createDOMPurifyfrom)
      return this.$sanitize(data.clinicContentImg, { svg: true })
    },
  },
}
</script>

<style lang="scss" module>
svg {
  width: 100%;
  height: 800px;
  background-color: white;
}
</style>
