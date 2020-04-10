<template>
  <v-row>
    <v-col class="d-flex" cols="12" sm="5">
      <v-select
        v-model="condition.selItem"
        style="width: 50px;"
        :items="condition.items"
        item-value="value"
        item-text="text"
        label="선택"
        outlined
        dense
        hide-details="true"
      ></v-select>
      <v-text-field
        v-model="condition.inputVal"
        label="입력"
        dense
        outlined
        hide-details="true"
      ></v-text-field>
    </v-col>

    <v-col class="text-left" cols="12" sm="4" md="4">
      <v-menu
        v-model="menu2"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-show="isHistory"
            v-model="dateRangeText"
            label="기간선택"
            readonly
            dense
            outlined
            clearable
            hide-details="true"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="condition.dates"
          locale="ko"
          range
          @change="onChangeDate"
        ></v-date-picker>
      </v-menu>
    </v-col>

    <v-col class="text-right" cols="12" sm="3" md="3">
      <v-btn color="primary" @click="search">검색</v-btn>
    </v-col>

    <v-col class="text-right d-flex" cols="12" sm="12" md="12">
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      isHistory: true,
      menu2: false,
      // 조건 목록
      condition: {
        selItem: 'contentTitle',
        items: [
          { text: '제목', value: 'contentTitle' },
          { text: '분과', value: 'majorNm' },
          { text: '의사명', value: 'drNm' },
          { text: '환자명', value: 'ptNm' },
        ],
        inputVal: '',
        dates: [],
      },
    }
  },

  /**
   * @INFO computed 속성은 계산해야 하는 목표 데이터를 정의하는 방식으로 소프트웨어 공학에서 이야기하는 ‘선언형 프로그래밍’ 방식
   */
  computed: {
    dateRangeText: {
      get() {
        return this.condition.dates.join(' ~ ')
      },
      set(newDate) {
        return newDate
      },
    },
  },

  created: function() {
    this.EventBus.$on('contentL_TO_searchL-1', (param) => {
      if (param.datas === 0) {
        this.isHistory = true
      } else {
        this.isHistory = false
        this.condition.dates = []
      }
    })
  },

  methods: {
    /**
     * 목록을 조회한다.
     */
    search() {
      const search = {}
      if (this.condition.dates.length > 0) {
        search.startClDate = this.condition.dates[0]
        search.endClDate = this.condition.dates[1]
      }

      search[this.condition.selItem] = this.condition.inputVal
      this.EventBus.$emit('searchL_TO_contentL-1', search)
    },

    /**
     * 날짜 유효성 검증을 한다.
     *
     * @param { String[] } dates 날짜 목록
     */
    onChangeDate(dates) {
      if (dates.length > 1 && dates[0] > dates[1]) {
        this.condition.dates.push(dates[0])
        this.condition.dates.shift()
      }
    },
  },
}
</script>
