<template>
  <v-content>
    <!-- 조회조건 영역 -->
    <SearchLayout />

    <!-- 컨텐츠 영역 -->
    <ContentLayout />

    <!-- 다이얼로그 영역  -->
    <DivDialog />
    <DeptDialog />
    <FormDialog />
  </v-content>
</template>

<script>
// 레이아웃
import SearchLayout from './layout/user-search-condition-layout.vue'
import ContentLayout from './layout/user-content-layout.vue'

// 다이얼로그
import DivDialog from './dialog/user-div-dialog.vue'
import DeptDialog from './dialog/user-dept-dialog.vue'
import FormDialog from './dialog/user-form-dialog.vue'

export default {
  page: {
    title: '사용자 목록',
  },
  components: {
    SearchLayout,
    ContentLayout,
    DivDialog,
    DeptDialog,
    FormDialog,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
}
</script>
