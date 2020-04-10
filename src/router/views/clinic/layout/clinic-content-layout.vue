<template>
  <v-row justify="center">
    <v-col class="text-left" cols="12" sm="12" md="12">
      <v-tabs
        v-model="activeTab"
        background-color="indigo"
        dark
        @change="chageTab($event)"
      >
        <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
        <v-tab :key="'history'">이력</v-tab>
        <v-tab :key="'useCnt'">사용량</v-tab>

        <v-tab-item :key="'history'">
          <v-card>
            <v-data-table
              class="elevation-1"
              :headers="historyHeaders"
              :items="datas1"
              :items-per-page="15"
              :footer-props="{
                showFirstLastPage: true,
                itemsPerPageText: '',
                itemsPerPageAllText: '전체',
              }"
            >
              <template v-slot:item="{ item, index }">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.clinicDt.substring(0, 10) }}</td>
                  <td
                    style="
                      font-weight: 900;
                      text-decoration: underline;
                      cursor: pointer;
                    "
                    @click="selectCtntTitle(item)"
                    >{{ item.clinicContentTitle }}</td
                  >
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>

        <v-tab-item :key="'useCnt'">
          <v-card>
            <v-data-table
              :headers="useCntHeaders"
              :items="datas2"
              :items-per-page="15"
              class="elevation-1"
              :footer-props="{
                showFirstLastPage: true,
                itemsPerPageText: '',
                itemsPerPageAllText: '전체',
              }"
            >
              <template v-slot:item="{ item, index }">
                <tr>
                  <td>{{ index + 1 }}</td>
                  <td
                    style="
                      font-weight: 900;
                      text-decoration: underline;
                      cursor: pointer;
                    "
                    @click="selectClinicCnt(item)"
                    >{{ item.clinicCnt }}</td
                  >
                  <td
                    style="
                      font-weight: 900;
                      text-decoration: underline;
                      cursor: pointer;
                    "
                    @click="selectCtntCnt(item)"
                    >{{ item.contentCnt }}</td
                  >
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-col></v-row
  >
</template>

<script>
import { getAllClinic, getAllClinicUsage } from '@api/clinic.api'

export default {
  data() {
    return {
      historyHeaders: [
        {
          text: '순번',
          align: 'start',
          sortable: false,
          value: 'no',
        },
        { text: '일자', value: 'clinicDt' },
        { text: '분과', value: 'majorNm' },
        { text: '제목', value: 'clinicContentTitle' },
      ],
      useCntHeaders: [
        {
          text: '순번',
          align: 'start',
          sortable: false,
          value: 'no',
        },
        { text: '진료건수', value: 'clinicCnt' },
        { text: '콘텐츠건수', value: 'ctntCnt' },
      ],

      activeTab: 0,

      params: {},

      datas1: [],
      datas2: [],
    }
  },

  /**
   * @INFO computed 속성은 계산해야 하는 목표 데이터를 정의하는 방식으로 소프트웨어 공학에서 이야기하는 ‘선언형 프로그래밍’ 방식
   */
  computed: {},

  /**
   * @INFO watch 속성은 감시할 데이터를 지정하고 그 데이터가 바뀌면 이런 함수를 실행하라는 방식으로 소프트웨어 공학에서 이야기하는 ‘명령형 프로그래밍’
   */
  watch: {},

  created() {
    this.initialize()
  },

  /**
   * @INFO data를 반응형으로 추적할 수 있게 되며 computed, methods, watch 등이 활성화되어 접근이 가능하게 된다. 하지만 아직까지 DOM에는 추가되지 않은 상태입니다.
   */
  methods: {
    /**
     * 초기화 이벤트다.
     */
    initialize() {
      this.EventBus.$on('searchL_TO_contentL-1', (condition) => {
        this.params = condition
        this.getItem()
      })

      this.getItem()
    },

    getItem() {
      if (this.activeTab === 0) {
        getAllClinic(this.params).then(
          (response) => {
            response.forEach((res) => {
              res.ptNm = res.ptNm == null ? '-' : res.ptNm
            })
            this.datas1 = response
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
      } else {
        getAllClinicUsage(this.params).then(
          (response) => {
            this.datas2 = response
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
      }
    },
    chageTab(e) {
      this.getItem()
      this.EventBus.$emit('contentL_TO_searchL-1', {
        datas: e,
      })
    },
    selectCtntTitle(item) {
      this.EventBus.$emit('contentL_TO_contentD-1', {
        datas: item,
      })
    },
    selectClinicCnt(item) {
      this.EventBus.$emit('contentL_TO_eduD-1', { drId: item.drId })
    },
    selectCtntCnt(item) {
      this.EventBus.$emit('contentL_TO_useContentD-1', { drId: item.drId })
    },
  },
}
</script>
