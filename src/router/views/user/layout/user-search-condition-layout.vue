<template>
  <v-row>
    <v-col class="d-flex" cols="12" sm="5">
      <v-select
        v-model="condition.selItem"
        style="width: 30px;"
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

    <v-col class="text-right" cols="12" sm="7" md="7">
      <v-btn color="primary" @click="search">검색</v-btn>
    </v-col>

    <v-col class="text-right d-flex" cols="12" sm="12" md="12">
      <v-divider></v-divider>
    </v-col>
  </v-row>
</template>

<script>
import { userMethods } from '@state/helpers'

export default {
  data() {
    return {
      // 조건 목록
      condition: {
        selItem: 'userId',
        items: [
          { text: 'ID', value: 'userId' },
          { text: '이름', value: 'userNm' },
        ],
        inputVal: '',
      },
    }
  },

  methods: {
    // 사용자 메서드
    ...userMethods,

    /**
     * 사용자를 조회한다.
     */
    search() {
      const search = {}
      search[this.condition.selItem] = this.condition.inputVal
      this.fetchUsers(search)
    },
  },
}
</script>
