<template>
  <v-row align="center" justify="center">
    <v-col class="text-center" cols="12" sm="6" md="4">
      <v-hover v-slot="{ hover }" open-delay="200">
        <v-card
          href="/clinic"
          :class="{ 'on-hover': hover }"
          :elevation="hover ? 16 : 2"
        >
          <v-img
            class="white--text align-end"
            height="auto"
            src="@assets/images/doctor2.jpg"
          >
          </v-img>

          <v-card-subtitle class="pb-0 title">이력관리</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>자료교육에 대한 이력을 관리합니다.</div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>

    <v-col cols="12" sm="6" md="4">
      <v-hover v-slot="{ hover }" open-delay="200">
        <v-card class="mx-auto" href="/user" :elevation="hover ? 16 : 2">
          <v-img
            class="white--text align-end"
            height="auto"
            src="@assets/images/doctor1.jpg"
          >
          </v-img>

          <v-card-subtitle class="pb-0 title">사용자관리</v-card-subtitle>

          <v-card-text class="text--primary">
            <div>Cube 사용자를 관리합니다.</div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script>
import appConfig from '@src/app.config'

export default {
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
}
</script>
