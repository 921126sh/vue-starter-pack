<template>
  <v-dialog v-model="isOpen" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">진료 교육 목록</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="12" md="12">
              <v-data-table :headers="headers" :items="datas">
                <template v-slot:item="{ item, index }">
                  <tr>
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.contentTitle }}</td>
                    <td>{{ item.ptNm }}</td>
                    <td>{{ item.clDt.substring(0, 10) }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="isOpen = false">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { getAllClinicContentCnt } from '@api/clinic.api'

export default {
  data() {
    return {
      // 다이얼로그 여부
      isOpen: false,
      // 테이블 헤더
      headers: [
        {
          text: '순번',
          value: 'no',
        },
        {
          text: '제목',
          value: 'clinicContentTitle',
        },
        {
          text: '환자명',
          value: 'ptNm',
        },
        {
          text: '교육일',
          value: 'clinicDt',
        },
      ],
      datas: [],
    }
  },

  /**
   * @INFO data를 반응형으로 추적할 수 있게 되며 computed, methods, watch 등이 활성화되어 접근이 가능하게 된다. 하지만 아직까지 DOM에는 추가되지 않은 상태입니다.
   */
  created() {
    console.log('Vue.prototype.$vuetify. :', this.$vuetify)
    this.EventBus.$on('contentL_TO_eduD-1', (condition) => {
      this.isOpen = true
      this.params = condition
      this.getItem()
    })
  },

  methods: {
    /**
     * 데이터를 요청한다.
     */
    getItem() {
      getAllClinicContentCnt(this.params).then(
        (response) => {
          this.datas = response
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
    },
  },
}
</script>
