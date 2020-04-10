<template>
  <v-app id="inspire">
    <notifications group="notifyApp" width="400" position="center" />

    <!-- <notifications group="notifyApp" position="top center">
      <template slot="body" slot-scope="props">
        <div>
          <a class="title">
            {{ props.item.title }}
          </a>
          <a class="close" @click="props.close">
            <v-icon>close</v-icon>
          </a>
          <div v-html="props.item.text"> </div>
        </div>
      </template>
    </notifications> -->

    <template v-if="isShowTopBottomLayout()">
      <v-container>
        <v-app-bar
          color="#FFFFFF"
          max-height="60px"
          min-height="60px"
          height="60px"
          elevation="0"
        >
          <v-toolbar-title class="font-weight-bold headline">
            <a href="/" style="color: #306dc9;">
              CUBE
            </a>
          </v-toolbar-title>

          <v-breadcrumbs :items="items" large class="pb-3 ml-8">
            <template v-slot:divider>
              <v-icon>mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>

          <v-spacer></v-spacer>

          <v-toolbar-title class="subtitle-1">
            <a href="logout" style="color: #acacac;">
              로그아웃
            </a>
          </v-toolbar-title>
        </v-app-bar>
      </v-container>
      <v-divider></v-divider>
    </template>

    <v-container
      :class="{
        'fill-height':
          ($router.history && $router.history.current.name === 'home') ||
          ($router.history && $router.history.current.name === 'login'),
      }"
    >
      <RouterView :key="$route.fullPath" />
    </v-container>

    <!-- <template v-if="isShowTopBottomLayout()">
      <v-divider class="mt-12"></v-divider>
      <v-container>
        <v-footer
          color="#FFFFFF"
          max-height="auto"
          min-height="1auto"
          height="auto"
        >
          <v-spacer></v-spacer>

          <span style="color: #999999; opacity: 1;">
            의료교육 저장소 "CUBE"<br />
            (주)아이쿱 사업자등록번호 114-86-94723 대표이사<br />
            조재형 우)06144 서울시 강남구 선릉로 107길 13(정진빌딩) 3층
            Copyright<br />
            &copy; 2020 iKooB Inc. All Rights Reserved.
          </span>
          <v-spacer></v-spacer>
        </v-footer>
      </v-container>
    </template> -->
  </v-app>
</template>

<script>
import appConfig from '@src/app.config'
import store from '@state/store'

export default {
  page: {
    /**
     *
     */
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  name: 'App',
  data: () => ({
    items: [
      {
        text: '홈',
        disabled: false,
        href: '/',
      },
      {
        text: '진료교육',
        disabled: true,
        href: '/clinic',
      },
    ],
  }),
  methods: {
    isShowTopBottomLayout() {
      return store.getters['auth/loggedIn']
    },
  },
}
</script>

<style lang="scss" module>
a:link {
  // color: #acacac !important;
  text-decoration: none;
}

a:visited {
  // color: #acacac !important;
  text-decoration: none;
}
</style>
