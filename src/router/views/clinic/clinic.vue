<template>
  <v-content>
    <!-- 조회조건 영역 -->
    <SearchLayout />
    <!-- 컨텐츠 영역 -->
    <ContentLayout />

    <!-- 다이얼로그 영역  -->
    <ClinicContentDialog />
    <ClinicEduDialog />
    <ClinicUseContentDialog />
  </v-content>
</template>

<script>
// 레이아웃
import SearchLayout from './layout/clinic-search-condition-layout.vue'
import ContentLayout from './layout/clinic-content-layout.vue'

// 다이얼로그
import ClinicContentDialog from './dialog/clinic-content-dialog.vue'
import ClinicEduDialog from './dialog/clinic-edu-dialog.vue'
import ClinicUseContentDialog from './dialog/clinic-use-content-dialog.vue'

export default {
  page: {
    title: '사용자 목록',
  },
  components: {
    SearchLayout,
    ContentLayout,
    ClinicContentDialog,
    ClinicEduDialog,
    ClinicUseContentDialog,
  },
}
</script>
